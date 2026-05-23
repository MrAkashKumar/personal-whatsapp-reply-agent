import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function readConfig(options = {}) {
  const { loadLocalEnv = true } = options;

  if (loadLocalEnv) {
    loadDotEnv();
  }

  return {
    port: numberFromEnv("PORT", 3000),
    publicBaseUrl: process.env.PUBLIC_BASE_URL || "",
    openai: {
      apiKey: process.env.OPENAI_API_KEY || "",
      apiBaseUrl: process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      reasoningEffort: process.env.OPENAI_REASONING_EFFORT || "low",
      maxOutputTokens: numberFromEnv("OPENAI_MAX_OUTPUT_TOKENS", 180),
      timeoutMs: numberFromEnv("OPENAI_TIMEOUT_MS", 9000)
    },
    whatsapp: {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
      appSecret: process.env.WHATSAPP_APP_SECRET || "",
      graphApiVersion: process.env.META_GRAPH_API_VERSION || "v23.0",
      timeoutMs: numberFromEnv("WHATSAPP_TIMEOUT_MS", 9000)
    },
    agent: {
      ownerName: process.env.OWNER_NAME || "Akash",
      ownerRole: process.env.OWNER_ROLE || "Senior Software Engineer",
      defaultLanguage: process.env.DEFAULT_LANGUAGE || "auto",
      autoReply: boolFromEnv("AUTO_REPLY", true),
      dryRun: boolFromEnv("DRY_RUN", true),
      sendReadReceipts: boolFromEnv("SEND_READ_RECEIPTS", false),
      replyWithContext: boolFromEnv("REPLY_WITH_CONTEXT", false),
      humanReviewNumbers: csvSet(process.env.HUMAN_REVIEW_NUMBERS || "")
    }
  };
}

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = stripQuotes(rawValue);
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function boolFromEnv(name, fallback) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function csvSet(value) {
  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}
