export function log(event: string, meta: Record<string, unknown> = {}) {
  console.log(JSON.stringify({
    level: "info",
    event,
    meta,
    timestamp: new Date().toISOString()
  }));
}

export function logError(event: string, error: unknown, meta: Record<string, unknown> = {}) {
  console.error(JSON.stringify({
    level: "error",
    event,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    meta,
    timestamp: new Date().toISOString()
  }));
}

