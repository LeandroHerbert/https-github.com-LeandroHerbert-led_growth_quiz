import { z } from "zod";
import { router, publicProcedure } from "../trpc.js";

// Áreas que ainda não têm implementação real (fora do escopo pedido agora:
// agendamento de reuniões via calendário, newsletter e gestão de vídeos).
// Retornam respostas "vazias/ok" só para as telas /agendar e /crm não quebrarem.

export const agendamentosRouter = router({
  listar: publicProcedure.query(async () => []),
  slotsDisponiveis: publicProcedure.input(z.any()).query(async () => []),
  criar: publicProcedure.input(z.any()).mutation(async () => ({ ok: true, id: "stub" })),
  atualizarStatus: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
});

export const leadsRouter = router({
  listar: publicProcedure.query(async () => []),
  inscrever: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
  atualizarStatus: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
  remover: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
  salvarNotas: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
});

export const videosRouter = router({
  listar: publicProcedure.query(async () => []),
  salvar: publicProcedure.input(z.any()).mutation(async () => ({ ok: true, id: "stub" })),
  deletar: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
  setAtivo: publicProcedure.input(z.any()).mutation(async () => ({ ok: true })),
});
