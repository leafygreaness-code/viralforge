export function log(event, meta = {}) {
    console.log(JSON.stringify({
        level: "info",
        event,
        meta,
        timestamp: new Date().toISOString()
    }));
}
export function logError(event, error, meta = {}) {
    console.error(JSON.stringify({
        level: "error",
        event,
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        meta,
        timestamp: new Date().toISOString()
    }));
}
