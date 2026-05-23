# Architect Guide: Users, Local Setup, and Deployment

This guide explains who should use this application, how to configure it on macOS, Windows, and Linux, and how to move from local testing to AWS deployment.

## 1. Who Is the Best Person to Use This Application?

![Best users for this application](assets/audience-fit.svg)

### Best Fit

This application is best for:

- Solo professionals who receive many WhatsApp Business messages.
- Freelancers, consultants, and founders.
- Small teams that need fast first replies.
- Customer support pilots.
- Lead-capture workflows where every inquiry should be acknowledged.
- Technical users who are comfortable with API keys and environment variables.

### Use Carefully

Use human review for:

- Money or payment requests.
- OTP, password, banking, and private data.
- Medical, legal, and financial topics.
- Hiring, contracts, or resignation decisions.
- Emotional conflict or relationship-sensitive conversations.

### Not a Good Fit

Do not use this app for:

- Unofficial personal WhatsApp automation.
- Scraping WhatsApp Web.
- Spam or mass marketing.
- Making serious decisions without a human.
- Uncontrolled group auto-replies.

Architect rule:

```text
Automate first response, not personal judgement.
```

## 2. What This Application Does

The app receives an incoming WhatsApp Business Cloud API message, checks whether it is safe to answer, asks OpenAI to write a short reply in your tone, and sends the reply back through the official WhatsApp Cloud API.

Safe default:

```bash
DRY_RUN=true
```

With `DRY_RUN=true`, the app logs replies but does not send real WhatsApp messages.

## 3. Local Setup Overview

![Cross-platform local setup](assets/cross-platform-local-setup.svg)

The runtime is the same on all operating systems:

- Node.js 20 or newer.
- npm.
- `.env` file.
- Local server on `http://localhost:3000`.

## 4. Prerequisites

Install these first:

- Node.js 20 or newer: https://nodejs.org/en/download/
- Git: https://git-scm.com/downloads
- ngrok for local webhook testing: https://ngrok.com/downloads

You also need:

- OpenAI API key.
- Meta WhatsApp Cloud API access token.
- WhatsApp phone number ID.
- A verify token you create yourself.

Read credentials guide:

[Meta WhatsApp credentials](META_WHATSAPP_CREDENTIALS.md)

## 5. macOS Setup

Open Terminal.

### 5.1 Check Node.js

```bash
node -v
npm -v
```

If Node.js is missing or below version 20, install Node.js from:

```text
https://nodejs.org/en/download/
```

If you use Homebrew:

```bash
brew install node
```

### 5.2 Open Project Folder

```bash
cd /Users/akash/Documents/Codex/2026-05-22/write-a-normal-person-are-chatting
```

### 5.3 Create Environment File

```bash
cp .env.example .env
```

Edit it:

```bash
nano .env
```

Minimum safe testing values:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_ACCESS_TOKEN=your-meta-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-random-verify-token
DRY_RUN=true
AUTO_REPLY=true
```

### 5.4 Run Checks

```bash
npm test
npm run check
```

### 5.5 Start Local Server

```bash
npm start
```

In another Terminal:

```bash
curl http://localhost:3000/health
```

Expected:

```json
{"ok":true,"dryRun":true,"autoReply":true}
```

## 6. Windows Setup

Use PowerShell.

### 6.1 Install Node.js

Option A: install Node.js LTS from:

```text
https://nodejs.org/en/download/
```

Option B: use winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen PowerShell, then check:

```powershell
node -v
npm -v
```

Node.js must be version 20 or newer.

### 6.2 Open Project Folder

Use the folder where you cloned or downloaded the repo. Example:

```powershell
cd C:\Projects\personal-whatsapp-reply-agent
```

### 6.3 Create Environment File

```powershell
Copy-Item .env.example .env
notepad .env
```

Add your real values:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_ACCESS_TOKEN=your-meta-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-random-verify-token
DRY_RUN=true
AUTO_REPLY=true
```

### 6.4 Run Checks

```powershell
npm test
npm run check
```

### 6.5 Start Local Server

```powershell
npm start
```

In another PowerShell window:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Expected:

```text
ok     dryRun autoReply
--     ------ ---------
True   True   True
```

## 7. Linux Setup

Use your terminal.

### 7.1 Install Node.js

Install Node.js 20 or newer from:

```text
https://nodejs.org/en/download/
```

You can also use your distro package manager, but confirm the version after install:

```bash
node -v
npm -v
```

If `node -v` is below 20, install a newer Node.js version from the official Node.js download page.

### 7.2 Open Project Folder

Use the folder where you cloned or downloaded the repo. Example:

```bash
cd ~/projects/personal-whatsapp-reply-agent
```

### 7.3 Create Environment File

```bash
cp .env.example .env
nano .env
```

Add:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_ACCESS_TOKEN=your-meta-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-random-verify-token
DRY_RUN=true
AUTO_REPLY=true
```

### 7.4 Run Checks

```bash
npm test
npm run check
```

### 7.5 Start Local Server

```bash
npm start
```

In another terminal:

```bash
curl http://localhost:3000/health
```

Expected:

```json
{"ok":true,"dryRun":true,"autoReply":true}
```

## 8. Run the Main Feature Locally

The main feature is:

```text
Receive WhatsApp message -> generate safe reply -> log or send WhatsApp reply
```

### 8.1 Keep Safe Mode On

In `.env`:

```bash
DRY_RUN=true
AUTO_REPLY=true
```

### 8.2 Start Server

```bash
npm start
```

### 8.3 Test Fake Incoming Message

macOS/Linux:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"contacts":[{"wa_id":"15551234567","profile":{"name":"Sam"}}],"messages":[{"from":"15551234567","id":"wamid.local-test-architect-1","timestamp":"1710000000","type":"text","text":{"body":"Hey Akash, can we discuss the API bug today?"}}]}}]}]}'
```

Windows PowerShell:

```powershell
$body = '{"entry":[{"changes":[{"value":{"contacts":[{"wa_id":"15551234567","profile":{"name":"Sam"}}],"messages":[{"from":"15551234567","id":"wamid.local-test-architect-1","timestamp":"1710000000","type":"text","text":{"body":"Hey Akash, can we discuss the API bug today?"}}]}}]}]}'
Invoke-RestMethod -Method Post -Uri http://localhost:3000/webhook -ContentType "application/json" -Body $body
```

Expected response:

```text
EVENT_RECEIVED
```

Expected terminal log:

```text
dry_run_reply
```

## 9. Test With Meta Using ngrok

Install ngrok:

```text
https://ngrok.com/downloads
```

Add auth token from ngrok dashboard:

```bash
ngrok config add-authtoken your-ngrok-auth-token
```

Start local server:

```bash
npm start
```

In another terminal:

```bash
ngrok http 3000
```

ngrok gives an HTTPS URL like:

```text
https://abc123.ngrok-free.app
```

Use this Meta callback URL:

```text
https://abc123.ngrok-free.app/webhook
```

Read detailed guide:

[ngrok guide](NGROK_GUIDE.md)

## 10. Local to AWS Deployment Path

![Local to cloud deployment path](assets/local-to-cloud-path.svg)

### 10.1 Package Lambda

```bash
npm run package:lambda
```

Output:

```text
dist/whatsapp-agent.zip
```

### 10.2 Deploy to AWS

Use:

- AWS Lambda
- API Gateway HTTP API
- CloudWatch Logs

Detailed steps:

[AWS deployment guide](AWS_DEPLOYMENT.md)

### 10.3 Final Production Switch

Keep this during testing:

```bash
DRY_RUN=true
```

Only after local, ngrok, and AWS webhook tests pass:

```bash
DRY_RUN=false
```

## 11. Senior Architect Checklist

Before enabling real replies:

- Node.js version is 20 or newer.
- `npm test` passes.
- `npm run check` passes.
- `/health` returns `ok: true`.
- Meta webhook verification works.
- `DRY_RUN=true` logs correct replies.
- Sensitive messages return safe acknowledgement.
- `WHATSAPP_ACCESS_TOKEN` is valid.
- `WHATSAPP_PHONE_NUMBER_ID` is correct.
- `WHATSAPP_VERIFY_TOKEN` matches Meta exactly.
- Cloud deployment uses AWS Lambda + API Gateway.
- Secrets are moved to AWS Secrets Manager or SSM before serious production use.

## 12. Quick Command Summary

macOS/Linux:

```bash
cp .env.example .env
npm test
npm run check
npm start
curl http://localhost:3000/health
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm test
npm run check
npm start
Invoke-RestMethod http://localhost:3000/health
```

AWS package:

```bash
npm run package:lambda
```
