# PRD: Personal WhatsApp Reply Agent

## 1. Product Goal

Build a fast, polite, natural WhatsApp communication layer that acknowledges incoming messages immediately and replies in the owner's style: warm, respectful, concise, and human.

This is not a replacement for the owner. It is a response assistant for simple, low-risk conversations and a triage layer for messages that need personal attention.

## 2. Target Users

- Owner: a busy senior software engineer who wants respectful, immediate WhatsApp replies.
- Senders: friends, family, partner, professional contacts, and general contacts.

## 3. Main Requirements

- Reply warmly and naturally.
- Use `I`, not `we`.
- Keep replies short unless the sender asks for detail.
- Match the sender's style when appropriate.
- Be more emotional for family, partner, or sensitive messages.
- Stay professional for work messages.
- Avoid robotic phrases.
- Avoid pretending to perform real-world actions.
- Escalate sensitive messages to human review.

## 4. Non-Goals

- No unofficial personal WhatsApp scraping or browser automation.
- No hidden decision-making for money, medical, legal, employment, or relationship commitments.
- No bulk marketing.
- No spam.
- No replacing a human in serious conversations.

## 5. MVP Flow

1. Sender sends a WhatsApp message.
2. WhatsApp Cloud API posts a webhook to `/webhook`.
3. Server verifies the webhook token or signature.
4. Server extracts inbound text messages.
5. Server checks duplicate message IDs.
6. Server checks whether the message needs human review.
7. Server sends the message to OpenAI with the persona instructions.
8. Server cleans the reply.
9. Server sends a WhatsApp text response.
10. Server stores short in-memory conversation history.

## 6. Reply Style Rules

The reply should usually be one to three short sentences.

Examples:

- Casual friend: `Haha yes, I get you. Give me a bit, I’ll check and reply properly.`
- Work contact: `Thanks for sending this. I’ll review it and get back to you shortly.`
- Family: `I saw your message. Don’t worry, I’ll call you in a bit.`
- If risky: `I saw this. Let me check properly and reply in a little while.`

## 7. Safety and Human Review

The system should avoid generating detailed replies for:

- Emergency or urgent health messages.
- Money requests or payment decisions.
- Legal, medical, or financial advice.
- Relationship conflict.
- Job offers, hiring, resignations, or commitments.
- Passwords, OTPs, banking details, or private credentials.

For these cases, send a short acknowledgement only.

## 8. Technical Design

Stack:

- Node.js 20+
- Native HTTP server for local development
- Native `fetch` for OpenAI and WhatsApp API calls
- AWS Lambda-compatible handler
- API Gateway HTTP API for public webhook
- Optional DynamoDB/SQS upgrade for production

Core modules:

- `app.js`: orchestration
- `replyAgent.js`: OpenAI call
- `persona.js`: communication instructions
- `webhook.js`: Meta payload parsing
- `client.js`: WhatsApp send API
- `memoryStore.js`: duplicate and history tracking

## 9. AWS MVP Infrastructure

Use:

- Lambda
- API Gateway HTTP API
- CloudWatch Logs

Avoid in MVP:

- NAT Gateway
- EC2
- RDS
- Always-on servers

These are not needed for low-volume WhatsApp webhooks and may create surprise cost.

## 10. Production Upgrade Plan

Phase 1:

- Local webhook verified.
- Dry-run replies tested.
- Live replies enabled for test phone number only.

Phase 2:

- Deploy Lambda + API Gateway.
- Add Meta app secret signature verification.
- Add CloudWatch alarm for Lambda errors.

Phase 3:

- Add SQS to acknowledge Meta immediately.
- Add DynamoDB for idempotency and conversation history.
- Add a small admin dashboard for approval/manual override.

Phase 4:

- Add contact profiles.
- Add manual review queue.
- Add metrics for latency, failures, and reply quality.

## 11. Success Metrics

- Webhook verification succeeds.
- 95% of simple messages receive a reply within 8 seconds.
- Zero duplicate replies for the same WhatsApp message ID.
- Risky messages get short acknowledgement only.
- Owner can disable sending with `DRY_RUN=true` or `AUTO_REPLY=false`.

## 12. Open Questions Before Production

- Which phone number will be used as the business number?
- Which contacts should always require human review?
- Which languages should be supported beyond auto-detection?
- Should the assistant mention delayed human follow-up during off-hours?
- Should business/work contacts use a stricter tone than friends and family?
