import { buildPersonaInstructions } from "./persona.js";

export async function generateReply({ config, incomingMessage, history = [] }) {
  if (!config.openai.apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.openai.timeoutMs);

  try {
    const response = await fetch(`${config.openai.apiBaseUrl}/responses`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: config.openai.model,
        reasoning: { effort: config.openai.reasoningEffort },
        instructions: buildPersonaInstructions(config.agent),
        input: [
          {
            role: "developer",
            content: "You are composing exactly one WhatsApp reply for the latest inbound message. Use the conversation history only for context."
          },
          {
            role: "user",
            content: JSON.stringify({
              sender: {
                whatsappId: incomingMessage.from,
                name: incomingMessage.profileName || "Unknown"
              },
              latestMessage: incomingMessage.text,
              messageType: incomingMessage.type,
              recentConversation: history.slice(-8),
              defaultLanguage: config.agent.defaultLanguage
            })
          }
        ],
        max_output_tokens: config.openai.maxOutputTokens
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error?.message || `OpenAI request failed with ${response.status}`);
    }

    return normalizeReply(extractOutputText(data));
  } finally {
    clearTimeout(timeout);
  }
}

export function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const chunks = [];

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

export function normalizeReply(reply) {
  const cleaned = String(reply || "")
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^reply:\s*/i, "")
    .trim();

  if (!cleaned) {
    return "I saw your message. I’ll reply properly in a bit.";
  }

  return cleaned.length > 1200 ? `${cleaned.slice(0, 1190).trim()}...` : cleaned;
}
