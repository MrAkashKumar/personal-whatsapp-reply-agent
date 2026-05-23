import { createServer as createHttpServer } from "node:http";
import { createWebhookProcessor } from "../app.js";
import { parseQueryParams, readRequestBody, sendJson, sendText } from "../utils/http.js";
import { verifyMetaSignature } from "../utils/signature.js";
import { verifyWebhookQuery } from "../whatsapp/webhook.js";

export function createServer({ config, logger }) {
  const processor = createWebhookProcessor({ config, logger });

  return createHttpServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
        ok: true,
        dryRun: config.agent.dryRun,
        autoReply: config.agent.autoReply
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/webhook") {
      const query = parseQueryParams(url.searchParams.toString());
      const challenge = verifyWebhookQuery(query, config.whatsapp.verifyToken);
      sendText(response, challenge.ok ? 200 : 403, challenge.ok ? challenge.challenge : "Verification failed");
      return;
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
      const rawBody = await readRequestBody(request);
      const signature = request.headers["x-hub-signature-256"];

      if (!verifyMetaSignature(rawBody, signature, config.whatsapp.appSecret)) {
        sendText(response, 401, "Invalid signature");
        return;
      }

      sendText(response, 200, "EVENT_RECEIVED");

      processor.processRawWebhook(rawBody).catch((error) => {
        logger.error("webhook_processing_failed", { error: error.message });
      });
      return;
    }

    sendText(response, 404, "Not found");
  });
}
