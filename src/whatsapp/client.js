export async function sendWhatsAppText({ config, to, body, contextMessageId, logger }) {
  assertWhatsAppConfig(config);

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: false,
      body
    }
  };

  if (contextMessageId) {
    payload.context = { message_id: contextMessageId };
  }

  const data = await callWhatsAppApi({
    config,
    payload,
    logger,
    action: "send_message"
  });

  logger.info("whatsapp_message_sent", {
    to,
    whatsappMessageId: data.messages?.[0]?.id || null
  });

  return data;
}

export async function markWhatsAppMessageRead({ config, messageId, logger }) {
  if (!config.whatsapp.accessToken || !config.whatsapp.phoneNumberId) {
    return;
  }

  try {
    await callWhatsAppApi({
      config,
      payload: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId
      },
      logger,
      action: "mark_read"
    });
  } catch (error) {
    logger.warn("mark_read_failed", { error: error.message, messageId });
  }
}

async function callWhatsAppApi({ config, payload, logger, action }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.whatsapp.timeoutMs);

  try {
    const response = await fetch(whatsappMessagesUrl(config), {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.whatsapp.accessToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      logger.error("whatsapp_api_failed", {
        action,
        status: response.status,
        error: data.error?.message || data
      });
      throw new Error(data.error?.message || `WhatsApp API failed with ${response.status}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function whatsappMessagesUrl(config) {
  return `https://graph.facebook.com/${config.whatsapp.graphApiVersion}/${config.whatsapp.phoneNumberId}/messages`;
}

function assertWhatsAppConfig(config) {
  const missing = [];

  if (!config.whatsapp.accessToken) {
    missing.push("WHATSAPP_ACCESS_TOKEN");
  }

  if (!config.whatsapp.phoneNumberId) {
    missing.push("WHATSAPP_PHONE_NUMBER_ID");
  }

  if (missing.length > 0) {
    throw new Error(`Missing WhatsApp config: ${missing.join(", ")}`);
  }
}
