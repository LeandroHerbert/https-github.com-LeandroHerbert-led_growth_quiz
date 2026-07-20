import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db } from "../../db/client.js";
import { quizResponses, quizCompletions, quizLeads } from "../../db/schema.js";

export const quizRouter = router({
  saveResponse: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        questionId: z.number(),
        selectedModel: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(quizResponses).values(input);
      return { ok: true };
    }),

  saveCompletion: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        primaryModel: z.string(),
        scores: z.record(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .insert(quizCompletions)
        .values(input)
        .onConflictDoUpdate({
          target: quizCompletions.sessionId,
          set: { primaryModel: input.primaryModel, scores: input.scores },
        });
      return { ok: true };
    }),

  getAnalytics: publicProcedure.query(async () => {
    const totalStartedRows = await db
      .select({ sessionId: quizResponses.sessionId })
      .from(quizResponses)
      .groupBy(quizResponses.sessionId);
    const totalCompletedRows = await db.select({ count: sql<number>`count(*)` }).from(quizCompletions);
    const byModelRows = await db
      .select({ primaryModel: quizCompletions.primaryModel, count: sql<number>`count(*)` })
      .from(quizCompletions)
      .groupBy(quizCompletions.primaryModel);

    const totalStarted = totalStartedRows.length;
    const totalQuizzes = Number(totalCompletedRows[0]?.count ?? 0);
    const completionRate = totalStarted > 0 ? Math.round((totalQuizzes / totalStarted) * 100) : 0;

    const modelDistribution: Record<string, number> = { SLG: 0, PLG: 0, MLG: 0, FLG: 0 };
    for (const row of byModelRows) {
      modelDistribution[row.primaryModel] = Number(row.count);
    }

    return { totalQuizzes, completionRate, modelDistribution };
  }),

  getDetailedData: publicProcedure.query(async () => {
    return db.select().from(quizCompletions).orderBy(quizCompletions.completedAt);
  }),
});
