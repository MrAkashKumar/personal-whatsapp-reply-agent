import { Buffer } from "node:buffer";
import { createWebhookProcessor } from "./app.js";
import { readConfig } from "./config/env.js";
import { createLogger } from "./utils/logger.js";
import { parseQueryParams } from "./utils/http.js";
import { verifyWebhookQuery } from "./whatsapp/webhook.js";
import { verifyMetaSignature } from "./utils/signature.js";

const config = readConfig({ loadLocalEnv: false });
const logger = createLogger();
const processor = createWebhookProcessor({ config, logger });

export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const rawPath = event.rawPath || event.path || "/";
  const headers = normalizeHeaders(event.headers || {});

  if (method === "GET" && rawPath === "/health") {
    return json(200, {
      ok: true,
      dryRun: config.agent.dryRun,
      autoReply: config.agent.autoReply
    });
  }

  if (method === "GET" && rawPath === "/webhook") {
    const query = event.queryStringParameters || parseQueryParams(event.rawQueryString || "");
    const challenge = verifyWebhookQuery(query, config.whatsapp.verifyToken);
    return challenge.ok
      ? text(200, challenge.challenge)
      : text(403, "Verification failed");
  }

  if (method === "POST" && rawPath === "/webhook") {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";

    if (!verifyMetaSignature(rawBody, headers["x-hub-signature-256"], config.whatsapp.appSecret)) {
      return text(401, "Invalid signature");
    }

    await processor.processRawWebhook(rawBody);
    return text(200, "EVENT_RECEIVED");
  }

  return text(404, "Not found");
}

function normalizeHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );
}

function text(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "text/plain; charset=utf-8" },
    body
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  };
}
