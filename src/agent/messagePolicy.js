const HUMAN_REVIEW_PATTERNS = [
  /\burgent\b/i,
  /\bemergency\b/i,
  /\bhospital\b/i,
  /\baccident\b/i,
  /\bdoctor\b/i,
  /\bmedicine\b/i,
  /\bmedical\b/i,
  /\bloan\b/i,
  /\bpay\b/i,
  /\bpayment\b/i,
  /\bsend money\b/i,
  /\bbank\b/i,
  /\botp\b/i,
  /\bpassword\b/i,
  /\blegal\b/i,
  /\blawyer\b/i,
  /\bcontract\b/i,
  /\bresign\b/i,
  /\boffer letter\b/i,
  /\bmarry\b/i,
  /\bbreakup\b/i,
  /\bdivorce\b/i
];

export function shouldSkipIncoming(message) {
  if (!message || !message.id || !message.from) {
    return { skip: true, reason: "invalid_message" };
  }

  if (message.isFromSelf) {
    return { skip: true, reason: "from_self" };
  }

  if (message.type === "unsupported") {
    return { skip: true, reason: "unsupported_message" };
  }

  return { skip: false };
}

export function shouldHoldForHuman(text = "") {
  for (const pattern of HUMAN_REVIEW_PATTERNS) {
    if (pattern.test(text)) {
      return { hold: true, reason: `matched_${pattern.source}` };
    }
  }

  return { hold: false };
}

export function buildHumanReviewReply() {
  return "I saw this. Let me check properly and reply in a bit.";
}

export function buildUnsupportedMessageReply() {
  return "Got it. I’ll check this properly and reply in a bit.";
}
