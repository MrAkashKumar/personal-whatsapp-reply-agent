# Visual Overview

This page explains the WhatsApp reply agent with one image and one practical example.

![WhatsApp Reply Agent Flow](assets/whatsapp-agent-flow.svg)

## Example Flow

1. A friend sends:

```text
Bro, are you free today?
```

2. WhatsApp Cloud API sends this message to your webhook:

```text
/webhook
```

3. The app checks:

- Is this message a duplicate?
- Is it a text message?
- Is it sensitive or risky?
- Is `AUTO_REPLY=true`?
- Is `DRY_RUN=true` or `false`?

4. If the message is normal, OpenAI writes a short reply in your tone:

```text
Yes, give me a bit. I'll check my timing and tell you shortly.
```

5. If `DRY_RUN=true`, the app logs the reply only.

6. If `DRY_RUN=false`, the app sends the reply through WhatsApp Cloud API.

## Local vs Production

Use ngrok when testing on your laptop:

```text
Meta WhatsApp -> ngrok HTTPS URL -> localhost:3000
```

Use AWS for real deployment:

```text
Meta WhatsApp -> API Gateway -> Lambda
```

## Safe Behavior

For risky messages like money, OTP, legal, medical, urgent, or emotional conflict, the app should not make decisions. It replies safely:

```text
I saw this. Let me check properly and reply in a bit.
```
