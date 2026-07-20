import { pgTable, text, integer, timestamp, jsonb, serial } from "drizzle-orm/pg-core";

export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedModel: text("selected_model").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizCompletions = pgTable("quiz_completions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  primaryModel: text("primary_model").notNull(),
  scores: jsonb("scores").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// crmStatus: novo | em_contato | sessao_marcada | sessao_realizada | comprou | nao_comprou
export const quizLeads = pgTable("quiz_leads", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  crmStatus: text("crm_status").notNull().default("novo"),
  dataSessao: text("data_sessao"),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
