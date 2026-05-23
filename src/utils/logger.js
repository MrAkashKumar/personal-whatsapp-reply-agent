export function createLogger() {
  return {
    info: (event, data = {}) => log("info", event, data),
    warn: (event, data = {}) => log("warn", event, data),
    error: (event, data = {}) => log("error", event, data)
  };
}

function log(level, event, data) {
  const entry = {
    level,
    event,
    time: new Date().toISOString(),
    ...data
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
}
