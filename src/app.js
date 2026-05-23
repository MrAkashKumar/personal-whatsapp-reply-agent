import { generateReply } from "./agent/replyAgent.js";
import {
  buildHumanReviewReply,
  buildUnsupportedMessageReply,
  shouldHoldForHuman,
  shouldSkipIncoming
} from "./agent/messagePolicy.js";
import { MemoryStore } from "./storage/memoryStore.js";
import { sendWhatsAppText, markWhatsAppMessageRead } from "./whatsapp/client.js";
import { parseIncomingMessages } from "./whatsapp/webhook.js";

export function createWebhookProcessor({ config, logger, store = new MemoryStore() }) {
  async function processRawWebhook(rawBody) {
    let payload;

    try {
      payload = JSON.parse(rawBody || "{}");
    } catch (error) {
      logger.warn("invalid_json_webhook", { message: error.message });
      return;
    }

    await processWebhookPayload(payload);
  }

  async function processWebhookPayload(payload) {
    const incomingMessages = parseIncomingMessages(payload);

    if (incomingMessages.length === 0) {
      logger.info("webhook_no_incoming_messages");
      return;
    }

    for (const message of incomingMessages) {
      await processIncomingMessage(message);
    }
  }

  async function processIncomingMessage(message) {
    if (store.hasMessage(message.id)) {
      logger.info("duplicate_message_ignored", { messageId: message.id });
      return;
    }

    store.markMessage(message.id);

    const skip = shouldSkipIncoming(message);
    if (skip.skip) {
      logger.info("message_skipped", { reason: skip.reason, messageId: message.id });
      return;
    }

    if (!config.agent.autoReply) {
      logger.info("auto_reply_disabled", { from: message.from, messageId: message.id });
      return;
    }

    const fixedReview = config.agent.humanReviewNumbers.has(message.from);
    const hold = fixedReview ? { hold: true, reason: "sender_in_human_review_list" } : shouldHoldForHuman(message.text);
    const history = store.getConversation(message.from);

    let reply;

    if (message.type !== "text") {
      reply = buildUnsupportedMessageReply(config.agent.ownerName);
    } else if (hold.hold) {
      reply = buildHumanReviewReply(config.agent.ownerName);
      logger.info("message_held_for_human", { reason: hold.reason, from: message.from });
    } else {
      try {
        reply = await generateReply({
          config,
          incomingMessage: message,
          history
        });
      } catch (error) {
        logger.error("reply_generation_failed", {
          error: error.message,
          from: message.from,
          messageId: message.id
        });
        reply = buildHumanReviewReply(config.agent.ownerName);
      }
    }

    store.addTurn(message.from, { role: "user", text: message.text, at: new Date().toISOString() });
    store.addTurn(message.from, { role: "assistant", text: reply, at: new Date().toISOString() });

    if (config.agent.sendReadReceipts) {
      await markWhatsAppMessageRead({ config, messageId: message.id, logger });
    }

    if (config.agent.dryRun) {
      logger.info("dry_run_reply", {
        to: message.from,
        reply,
        messageId: message.id
      });
      return;
    }

    await sendWhatsAppText({
      config,
      to: message.from,
      body: reply,
      contextMessageId: config.agent.replyWithContext ? message.id : undefined,
      logger
    });
  }

  return {
    processRawWebhook,
    processWebhookPayload
  };
}
