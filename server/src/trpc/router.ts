import { router } from "./trpc.js";
import { quizRouter } from "./procedures/quiz.js";
import { quizLeadsRouter } from "./procedures/quizLeads.js";
import { agendamentosRouter, leadsRouter, videosRouter } from "./procedures/stubs.js";

export const appRouter = router({
  quiz: quizRouter,
  quizLeads: quizLeadsRouter,
  agendamentos: agendamentosRouter,
  leads: leadsRouter,
  videos: videosRouter,
});

export type AppRouter = typeof appRouter;
