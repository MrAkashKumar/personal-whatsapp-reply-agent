import { createServer } from "./server/httpServer.js";
import { readConfig } from "./config/env.js";
import { createLogger } from "./utils/logger.js";

const config = readConfig();
const logger = createLogger();
const server = createServer({ config, logger });

server.listen(config.port, () => {
  logger.info("server_started", {
    port: config.port,
    dryRun: config.agent.dryRun,
    autoReply: config.agent.autoReply
  });
});
