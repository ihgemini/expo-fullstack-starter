import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  userEmail: text("user_email").notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userEmail: text("user_email").notNull(),
});

export const mentions = sqliteTable("mentions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userEmail: text("user_email").notNull(),
});

// Junction tables for many-to-many relationships
export const noteTags = sqliteTable(
  "note_tags",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.noteId, table.tagId] }),
  })
);

export const noteMentions = sqliteTable(
  "note_mentions",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    mentionId: text("mention_id")
      .notNull()
      .references(() => mentions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.noteId, table.mentionId] }),
  })
);

// Relations
export const notesRelations = relations(notes, ({ many }) => ({
  noteTags: many(noteTags),
  noteMentions: many(noteMentions),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const mentionsRelations = relations(mentions, ({ many }) => ({
  noteMentions: many(noteMentions),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, { fields: [noteTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [noteTags.tagId], references: [tags.id] }),
}));

export const noteMentionsRelations = relations(noteMentions, ({ one }) => ({
  note: one(notes, { fields: [noteMentions.noteId], references: [notes.id] }),
  mention: one(mentions, {
    fields: [noteMentions.mentionId],
    references: [mentions.id],
  }),
}));
