import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { notes, tags, mentions, noteTags, noteMentions } from "../../db/schema";
import { eq, desc, and, gte, lt, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/server/db";

// Helper functions for managing tags and mentions
async function getOrCreateTag(name: string, userEmail: string) {
  const existingTag = await db
    .select()
    .from(tags)
    .where(and(eq(tags.name, name), eq(tags.userEmail, userEmail)))
    .limit(1);

  if (existingTag.length > 0) {
    return existingTag[0];
  }

  const newTag = {
    id: nanoid(),
    name,
    userEmail,
  };

  await db.insert(tags).values(newTag);
  return newTag;
}

async function getOrCreateMention(name: string, userEmail: string) {
  const existingMention = await db
    .select()
    .from(mentions)
    .where(and(eq(mentions.name, name), eq(mentions.userEmail, userEmail)))
    .limit(1);

  if (existingMention.length > 0) {
    return existingMention[0];
  }

  const newMention = {
    id: nanoid(),
    name,
    userEmail,
  };

  await db.insert(mentions).values(newMention);
  return newMention;
}

export const notesRouter = createTRPCRouter({
  // Get all notes for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userNotes = await ctx.db.query.notes.findMany({
      where: eq(notes.userEmail, ctx.user.email),
      orderBy: [desc(notes.createdAt)],
      with: {
        noteTags: {
          with: {
            tag: true,
          },
        },
        noteMentions: {
          with: {
            mention: true,
          },
        },
      },
    });

    return userNotes.map((note) => ({
      ...note,
      tags: note.noteTags.map((nt) => nt.tag.name),
      mentions: note.noteMentions.map((nm) => nm.mention.name),
    }));
  }),

  // Get today's notes
  getToday: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayNotes = await ctx.db.query.notes.findMany({
      where: and(
        eq(notes.userEmail, ctx.user.email),
        gte(notes.createdAt, today),
        lt(notes.createdAt, tomorrow)
      ),
      orderBy: [desc(notes.createdAt)],
      with: {
        noteTags: {
          with: {
            tag: true,
          },
        },
        noteMentions: {
          with: {
            mention: true,
          },
        },
      },
    });

    return todayNotes.map((note) => ({
      ...note,
      tags: note.noteTags.map((nt) => nt.tag.name),
      mentions: note.noteMentions.map((nm) => nm.mention.name),
      synced: true, // Assuming all notes fetched are synced
    }));
  }),

  // Create a new note
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        content: z.string(),
        tags: z.array(z.string()).optional(),
        mentions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const noteId = input.id;

      // Create the note first
      const newNote = {
        id: noteId,
        title: input.title,
        content: input.content,
        userEmail: ctx.user.email,
        createdAt: now,
        updatedAt: now,
      };

      await ctx.db.insert(notes).values(newNote);

      // Handle tags
      if (input.tags && input.tags.length > 0) {
        for (const tagName of input.tags) {
          const tag = await getOrCreateTag(tagName, ctx.user.email);
          await ctx.db.insert(noteTags).values({
            noteId,
            tagId: tag.id,
          });
        }
      }

      // Handle mentions
      if (input.mentions && input.mentions.length > 0) {
        for (const mentionName of input.mentions) {
          const mention = await getOrCreateMention(mentionName, ctx.user.email);
          await ctx.db.insert(noteMentions).values({
            noteId,
            mentionId: mention.id,
          });
        }
      }

      return {
        ...newNote,
        tags: input.tags || [],
        mentions: input.mentions || [],
      };
    }),

  // Update a note
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        content: z.string(),
        tags: z.array(z.string()).optional(),
        mentions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update the note itself
      await ctx.db
        .update(notes)
        .set({
          title: input.title,
          content: input.content,
          updatedAt: new Date(),
        })
        .where(
          and(eq(notes.id, input.id), eq(notes.userEmail, ctx.user.email))
        );

      // Remove existing tags and mentions
      await ctx.db.delete(noteTags).where(eq(noteTags.noteId, input.id));
      await ctx.db
        .delete(noteMentions)
        .where(eq(noteMentions.noteId, input.id));

      // Handle tags
      if (input.tags && input.tags.length > 0) {
        for (const tagName of input.tags) {
          const tag = await getOrCreateTag(tagName, ctx.user.email);
          await ctx.db.insert(noteTags).values({
            noteId: input.id,
            tagId: tag.id,
          });
        }
      }

      // Handle mentions
      if (input.mentions && input.mentions.length > 0) {
        for (const mentionName of input.mentions) {
          const mention = await getOrCreateMention(mentionName, ctx.user.email);
          await ctx.db.insert(noteMentions).values({
            noteId: input.id,
            mentionId: mention.id,
          });
        }
      }

      return {
        id: input.id,
        title: input.title,
        content: input.content,
        tags: input.tags || [],
        mentions: input.mentions || [],
      };
    }),

  // Delete a note
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete related tags and mentions (cascade should handle this)
      await ctx.db
        .delete(notes)
        .where(
          and(eq(notes.id, input.id), eq(notes.userEmail, ctx.user.email))
        );
    }),

  // Get unique tags used by the user (for suggestions)
  getTags: protectedProcedure.query(async ({ ctx }) => {
    const userTags = await ctx.db
      .select({ name: tags.name })
      .from(tags)
      .where(eq(tags.userEmail, ctx.user.email))
      .orderBy(tags.name);

    return userTags.map((tag) => tag.name);
  }),

  // Get unique mentions used by the user (for suggestions)
  getMentions: protectedProcedure.query(async ({ ctx }) => {
    const userMentions = await ctx.db
      .select({ name: mentions.name })
      .from(mentions)
      .where(eq(mentions.userEmail, ctx.user.email))
      .orderBy(mentions.name);

    return userMentions.map((mention) => mention.name);
  }),
});
