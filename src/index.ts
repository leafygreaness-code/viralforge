import express from "express";
import path from "node:path";
import { env } from "./config.js";
import { ensureMediaDirs, generatedRoot } from "./lib/media.js";
import { generationsRouter } from "./routes/generations.js";
import { projectsRouter } from "./routes/projects.js";
import { publishRouter } from "./routes/publish.js";
import { webhooksRouter } from "./routes/webhooks.js";
import { log, logError } from "./lib/logger.js";

const app = express();
const apiPrefix = normalizePrefix(env.API_PREFIX);

app.use(express.json({ limit: "2mb" }));
void ensureMediaDirs();
app.use(`${apiPrefix}/generated`, express.static(generatedRoot));

app.get(`${apiPrefix}/`, (_req, res) => {
  res.json({
    ok: true,
    service: "vivida-infra",
    message: "Vivida backend is running",
    health: `${apiPrefix}/health`,
    projects: `${apiPrefix}/v1/projects`
  });
});

app.get(`${apiPrefix}/health`, (_req, res) => {
  res.json({
    ok: true,
    service: "vivida-infra",
    env: env.NODE_ENV
  });
});

app.use(`${apiPrefix}/v1/projects`, projectsRouter);
app.use(`${apiPrefix}/v1/generations`, generationsRouter);
app.use(`${apiPrefix}/v1/publish-jobs`, publishRouter);
app.use(`${apiPrefix}/v1/webhooks`, webhooksRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logError("http.unhandled_error", error);
  res.status(500).json({
    error: error instanceof Error ? error.message : "Internal server error"
  });
});

app.listen(env.PORT, () => {
  log("server.started", {
    port: env.PORT,
    baseUrl: env.API_BASE_URL,
    apiPrefix
  });
});

function normalizePrefix(prefix: string) {
  if (!prefix || prefix === "/") {
    return "";
  }

  return prefix.startsWith("/") ? prefix : `/${prefix}`;
}
