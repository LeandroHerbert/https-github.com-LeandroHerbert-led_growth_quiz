import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db } from "../../db/client.js";
import { quizLeads, quizCompletions } from "../../db/schema.js";

const CRM_STATUSES = [
  "novo",
  "em_contato",
  "sessao_marcada",
  "sessao_realizada",
  "comprou",
  "nao_comprou",
] as const;

async function listWithResultado() {
  const rows = await db
    .select({
      id: quizLeads.id,
      sessionId: quizLeads.sessionId,
      nome: quizLeads.nome,
      whatsapp: quizLeads.whatsapp,
      email: quizLeads.email,
      crmStatus: quizLeads.crmStatus,
      dataSessao: quizLeads.dataSessao,
      notas: quizLeads.notas,
      createdAt: quizLeads.createdAt,
      resultadoModelo: quizCompletions.primaryModel,
    })
    .from(quizLeads)
    .leftJoin(quizCompletions, eq(quizLeads.sessionId, quizCompletions.sessionId))
    .orderBy(desc(quizLeads.createdAt));
  return rows;
}

export const quizLeadsRouter = router({
  salvar: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        nome: z.string().min(2),
        whatsapp: z.string().min(10),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const [lead] = await db.insert(quizLeads).values(input).returning();
      return lead;
    }),

  listar: publicProcedure.query(async () => {
    return listWithResultado();
  }),

  listarParaExport: publicProcedure.query(async () => {
    return listWithResultado();
  }),

  atualizarStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        crmStatus: z.enum(CRM_STATUSES).optional(),
        dataSessao: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const [lead] = await db.update(quizLeads).set(rest).where(eq(quizLeads.id, id)).returning();
      return lead;
    }),

  salvarNotas: publicProcedure
    .input(z.object({ id: z.number(), notas: z.string() }))
    .mutation(async ({ input }) => {
      const [lead] = await db
        .update(quizLeads)
        .set({ notas: input.notas })
        .where(eq(quizLeads.id, input.id))
        .returning();
      return lead;
    }),

  remover: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(quizLeads).where(eq(quizLeads.id, input.id));
      return { ok: true };
    }),
});
