# Local Run Guide

This guide shows exactly how to run the WhatsApp reply agent on your local machine.

## 1. Open the Project Folder

```bash
cd /Users/akash/Documents/Codex/2026-05-22/write-a-normal-person-are-chatting
```

## 2. Check Node.js Version

This project needs Node.js 20 or newer.

```bash
node -v
```

If your version is lower than 20, install Node.js 20+ first.

## 3. Create Your Local Environment File

```bash
cp .env.example .env
```

Open `.env` and fill your real details.

Minimum for local dry-run testing:

```bash
PORT=3000
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_VERIFY_TOKEN=make-any-long-random-secret
DRY_RUN=true
AUTO_REPLY=true
```

Minimum for real WhatsApp sending:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_ACCESS_TOKEN=your-meta-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-webhook-verify-token
DRY_RUN=false
AUTO_REPLY=true
```

Keep `DRY_RUN=true` until your webhook and reply quality are working.

## 4. Run Checks

```bash
npm test
npm run check
```

You should see all tests passing and syntax OK.

## 5. Start the Local Server

```bash
npm start
```

Expected log:

```text
server_started
```

The local server will run on:

```text
http://localhost:3000
```

## 6. Check Health

Open another terminal and run:

```bash
curl http://localhost:3000/health
```

Expected result:

```json
{"ok":true,"dryRun":true,"autoReply":true}
```

## 7. Test Webhook Verification Locally

Replace `your-token` with your `.env` value for `WHATSAPP_VERIFY_TOKEN`.

```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=your-token&hub.challenge=hello123"
```

Expected result:

```text
hello123
```

## 8. Test a Fake Incoming Message

This checks whether your server receives a WhatsApp-style webhook payload.

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"contacts":[{"wa_id":"15551234567","profile":{"name":"Sam"}}],"messages":[{"from":"15551234567","id":"wamid.local-test-1","timestamp":"1710000000","type":"text","text":{"body":"Hey bro, are you free today?"}}]}}]}]}'
```

If `DRY_RUN=true`, the app will log the generated reply instead of sending it to WhatsApp.

## 9. Expose Localhost to Meta

Meta needs a public HTTPS URL for webhooks. Use a tunnel.

With ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS URL, then configure Meta webhook:

```text
https://your-ngrok-url/webhook
```

Use the same verify token from:

```text
WHATSAPP_VERIFY_TOKEN
```

Subscribe to WhatsApp `messages` events.

## 10. Send Real WhatsApp Test

In Meta WhatsApp API setup:

1. Add your own phone number as a test recipient.
2. Send a message to the test WhatsApp Business number.
3. Watch your local terminal logs.
4. Keep `DRY_RUN=true` first.
5. When everything is correct, set:

```bash
DRY_RUN=false
```

Restart:

```bash
npm start
```

Now the app can send real WhatsApp replies.

## Common Problems

### `OPENAI_API_KEY is missing`

Add your OpenAI API key in `.env`.

### `Verification failed`

Your Meta webhook verify token does not match `WHATSAPP_VERIFY_TOKEN`.

### Message received but no WhatsApp reply sent

Check:

```bash
DRY_RUN=false
AUTO_REPLY=true
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
```

### WhatsApp API token expired

Temporary Meta tokens expire. For production, create a permanent/system user token in Meta Business settings.

### Port already in use

Change the port:

```bash
PORT=3001
```

Then run:

```bash
npm start
```

Health URL becomes:

```text
http://localhost:3001/health
```
