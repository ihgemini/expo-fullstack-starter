import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      await sleep(2000);
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  auth: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),
  getPosts: publicProcedure.query(async ({ ctx }) => {
    await sleep(6000);
    // Query to get all table names from the SQLite database
    const result = await ctx.db.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
    );
    return { tables: result.map((row: any) => row.name) };
  }),
});
