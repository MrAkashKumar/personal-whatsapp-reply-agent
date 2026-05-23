import test from "node:test";
import assert from "node:assert/strict";
import { shouldHoldForHuman, shouldSkipIncoming } from "../src/agent/messagePolicy.js";

test("shouldHoldForHuman catches sensitive messages", () => {
  assert.equal(shouldHoldForHuman("Can you send money now?").hold, true);
});

test("shouldHoldForHuman allows normal chat", () => {
  assert.equal(shouldHoldForHuman("Are you coming for dinner?").hold, false);
});

test("shouldSkipIncoming skips invalid messages", () => {
  assert.equal(shouldSkipIncoming({}).skip, true);
});
