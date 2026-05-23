import test from "node:test";
import assert from "node:assert/strict";
import { parseIncomingMessages, verifyWebhookQuery } from "../src/whatsapp/webhook.js";

test("verifyWebhookQuery accepts matching verify token", () => {
  const result = verifyWebhookQuery(
    {
      "hub.mode": "subscribe",
      "hub.verify_token": "secret",
      "hub.challenge": "12345"
    },
    "secret"
  );

  assert.deepEqual(result, { ok: true, challenge: "12345" });
});

test("parseIncomingMessages extracts text messages", () => {
  const payload = {
    entry: [
      {
        changes: [
          {
            value: {
              contacts: [
                {
                  wa_id: "15551234567",
                  profile: { name: "Sam" }
                }
              ],
              messages: [
                {
                  from: "15551234567",
                  id: "wamid.abc",
                  timestamp: "1710000000",
                  type: "text",
                  text: { body: "Hey, are you free?" }
                }
              ]
            }
          }
        ]
      }
    ]
  };

  assert.deepEqual(parseIncomingMessages(payload), [
    {
      id: "wamid.abc",
      from: "15551234567",
      timestamp: "1710000000",
      type: "text",
      text: "Hey, are you free?",
      profileName: "Sam",
      raw: payload.entry[0].changes[0].value.messages[0]
    }
  ]);
});
