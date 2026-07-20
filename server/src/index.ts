import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.resolve(__dirname, "../../");
const PORT = process.env.PORT ? Number(process.env.PORT) : 8935;

const app = express();

app.use("/api/trpc", (req, _res, next) => {
  console.log(`[trpc] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    onError({ path, error }) {
      console.error(`[trpc error] ${path}:`, error.message);
    },
  })
);

app.use("/assets", express.static(path.join(CLIENT_DIR, "assets")));

// Página de captação nova (copywriting/layout próprios), reescrita do zero.
// O quiz de verdade (perguntas, pontuação, captação de lead) continua em "/".
app.get("/diagnostico", (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, "diagnostico.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
