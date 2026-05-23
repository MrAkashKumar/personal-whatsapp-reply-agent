export function verifyWebhookQuery(query, expectedVerifyToken) {
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];

  if (mode === "subscribe" && token && token === expectedVerifyToken) {
    return { ok: true, challenge: challenge || "" };
  }

  return { ok: false };
}

export function parseIncomingMessages(payload) {
  const messages = [];

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      const contactsByWaId = mapContacts(value.contacts || []);

      for (const item of value.messages || []) {
        messages.push(normalizeMessage(item, contactsByWaId));
      }
    }
  }

  return messages;
}

function mapContacts(contacts) {
  const map = new Map();

  for (const contact of contacts) {
    if (contact.wa_id) {
      map.set(contact.wa_id, contact);
    }
  }

  return map;
}

function normalizeMessage(item, contactsByWaId) {
  const contact = contactsByWaId.get(item.from) || {};
  const type = item.type || "unsupported";

  return {
    id: item.id,
    from: item.from,
    timestamp: item.timestamp,
    type,
    text: type === "text" ? item.text?.body || "" : "",
    profileName: contact.profile?.name || "",
    raw: item
  };
}
