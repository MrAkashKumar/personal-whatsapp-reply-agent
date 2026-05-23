import test from "node:test";
import assert from "node:assert/strict";
import { extractOutputText, normalizeReply } from "../src/agent/replyAgent.js";

test("extractOutputText reads output_text", () => {
  assert.equal(extractOutputText({ output_text: "Hello there" }), "Hello there");
});

test("extractOutputText reads nested response content", () => {
  const data = {
    output: [
      {
        content: [
          {
            text: "Thanks, I’ll check."
          }
        ]
      }
    ]
  };

  assert.equal(extractOutputText(data), "Thanks, I’ll check.");
});

test("normalizeReply removes labels and quotes", () => {
  assert.equal(normalizeReply('"Reply: I saw this."'), "I saw this.");
});

test("normalizeReply falls back for empty text", () => {
  assert.match(normalizeReply(""), /I saw your message/);
});
