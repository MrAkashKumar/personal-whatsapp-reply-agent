# Personal WhatsApp Reply Agent

A small, maintainable starter repo for a WhatsApp Business Cloud API webhook that replies in a warm, natural, concise style using OpenAI.

Important: this project is for the official WhatsApp Business Platform / Cloud API with a business phone number. WhatsApp does not provide an official API for automating a normal personal WhatsApp account.

## Documentation Map

Use this section to jump to the right guide.

| Need | Document |
| --- | --- |
| Senior architect guide: best users, local setup, OS commands, deployment path | [Architect local/deployment guide](docs/ARCHITECT_LOCAL_DEPLOYMENT_GUIDE.md) |
| Watch iPhone 13 Tarus real-time reply demo | [iPhone Tarus screen recording demo](docs/IPHONE_TARUS_SCREEN_RECORDING_DEMO.md) |
| Watch Hindi Tarus bakchodi demo | [iPhone Tarus Hindi bakchodi demo](docs/IPHONE_TARUS_HINDI_BAKCHODI_DEMO.md) |
| See the visual workflow image | [Visual overview](docs/VISUAL_OVERVIEW.md) |
| See real-time individual and group examples | [Real-time examples](docs/REALTIME_EXAMPLES.md) |
| Understand what this app does | [Use cases](docs/USE_CASES.md) |
| Product requirements and roadmap | [PRD](docs/PRD.md) |
| Run the project locally | [Local run guide](docs/LOCAL_RUN_GUIDE.md) |
| Test WhatsApp webhooks locally with ngrok | [ngrok guide](docs/NGROK_GUIDE.md) |
| Create Meta WhatsApp token, verify token, and phone number ID | [Meta WhatsApp credentials](docs/META_WHATSAPP_CREDENTIALS.md) |
| Deploy to AWS Lambda and API Gateway | [AWS deployment guide](docs/AWS_DEPLOYMENT.md) |
| General setup notes | [Setup guide](docs/SETUP.md) |

## Local Machine Quick Start

Use this section when you want to run the app on your own laptop or desktop first.

### 1. Install Node.js

Install Node.js 20 or newer from [nodejs.org](https://nodejs.org/en/download/).

Check version:

```bash
node -v
npm -v
```

### 2. Open Project Folder

macOS/Linux:

```bash
cd /Users/akash/Documents/Codex/2026-05-22/write-a-normal-person-are-chatting
```

Windows PowerShell example:

```powershell
cd C:\Projects\personal-whatsapp-reply-agent
```

### 3. Create `.env`

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and add your keys:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
WHATSAPP_ACCESS_TOKEN=your-meta-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-random-verify-token
DRY_RUN=true
AUTO_REPLY=true
```

Keep `DRY_RUN=true` while testing. This logs replies without sending real WhatsApp messages.

### 4. Verify Project

```bash
npm test
npm run check
```

Both commands should pass before you connect WhatsApp.

### 5. Start Local Server

```bash
npm start
```

The app runs on:

```text
http://localhost:3000
```

### 6. Test Health

Open another terminal.

macOS/Linux:

```bash
curl http://localhost:3000/health
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Expected result:

```json
{"ok":true,"dryRun":true,"autoReply":true}
```

### 7. Test Meta Webhook Locally

To let Meta call your local app, start ngrok:

```bash
ngrok http 3000
```

Use the HTTPS URL from ngrok:

```text
https://your-ngrok-url/webhook
```

Paste that URL into Meta webhook settings with the same `WHATSAPP_VERIFY_TOKEN`.

Full local guide: [Local run guide](docs/LOCAL_RUN_GUIDE.md)  
Full ngrok guide: [ngrok guide](docs/NGROK_GUIDE.md)  
OS-specific guide: [Architect local/deployment guide](docs/ARCHITECT_LOCAL_DEPLOYMENT_GUIDE.md)

## What This Does

- Receives inbound WhatsApp webhook events.
- Verifies Meta webhook setup with a custom verify token.
- Optionally verifies `X-Hub-Signature-256` using your Meta app secret.
- Generates short, human-sounding replies with OpenAI's Responses API.
- Sends replies through the WhatsApp Cloud API.
- Uses careful fallback replies when the message needs human attention.
- Runs locally with Node.js or as an AWS Lambda handler.

## Real-Time Examples

Friend demo on iPhone 13:

![iPhone 13 Tarus real-time reply demo](docs/assets/iphone13-tarus-realtime-demo.gif)

Hindi/Hinglish bakchodi friend demo:

![iPhone 13 Tarus Hindi bakchodi demo](docs/assets/iphone13-tarus-hindi-bakchodi-demo.gif)

Video files:

- [MOV screen recording](docs/assets/iphone13-tarus-realtime-demo.mov)
- [M4V screen recording](docs/assets/iphone13-tarus-realtime-demo.m4v)
- [Hindi MOV screen recording](docs/assets/iphone13-tarus-hindi-bakchodi-demo.mov)
- [Hindi M4V screen recording](docs/assets/iphone13-tarus-hindi-bakchodi-demo.m4v)

For the exact Tarus scenario, read [iPhone Tarus screen recording demo](docs/IPHONE_TARUS_SCREEN_RECORDING_DEMO.md).
For the Hindi/Hinglish version, read [iPhone Tarus Hindi bakchodi demo](docs/IPHONE_TARUS_HINDI_BAKCHODI_DEMO.md).

Individual normal message:

![Individual normal chat flow](docs/assets/realtime-individual-normal.svg)

Individual sensitive message:

![Individual sensitive chat flow](docs/assets/realtime-individual-sensitive.svg)

Group chat behavior:

![Group chat behavior flow](docs/assets/realtime-group-behavior.svg)

For exact scenarios and reply examples, read [Real-time examples](docs/REALTIME_EXAMPLES.md).

## Who Should Use It and How to Run It

Best-fit users:

![Best users for this application](docs/assets/audience-fit.svg)

Cross-platform local setup:

![Cross-platform local setup](docs/assets/cross-platform-local-setup.png)

Local-to-cloud deployment path:

![Local to cloud deployment path](docs/assets/local-to-cloud-path.svg)

For exact macOS, Windows, Linux, ngrok, and AWS steps, read [Architect local/deployment guide](docs/ARCHITECT_LOCAL_DEPLOYMENT_GUIDE.md).

## Architecture

![WhatsApp Reply Agent Flow](docs/assets/whatsapp-agent-flow.svg)

```mermaid
flowchart LR
  A["Sender on WhatsApp"] --> B["WhatsApp Cloud API"]
  B --> C["Webhook: API Gateway or local server"]
  C --> D["Message parser and safety rules"]
  D --> E["OpenAI Responses API"]
  E --> F["Reply cleaner"]
  F --> G["WhatsApp send message endpoint"]
  G --> A
```

## Local Setup

1. Install Node.js 20 or newer.
2. Create a WhatsApp Business app in Meta for Developers.
3. Copy `.env.example` to `.env`.
4. Fill in:
   - `OPENAI_API_KEY`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_VERIFY_TOKEN`
   - `WHATSAPP_APP_SECRET` if you want signature checks
5. Keep `DRY_RUN=true` for your first local test.
6. Run:

```bash
npm test
npm run check
npm start
npm run package:lambda
```

7. Expose your local server with a tunnel such as ngrok or Cloudflare Tunnel:

```bash
ngrok http 3000
```

8. In Meta webhook settings, set:
   - Callback URL: `https://your-tunnel-url/webhook`
   - Verify token: the same value as `WHATSAPP_VERIFY_TOKEN`

When you are happy with logs and generated replies, set `DRY_RUN=false`.

## AWS Free-Tier-Friendly Deployment

Recommended MVP:

- AWS Lambda for compute.
- API Gateway HTTP API for `/webhook`.
- Environment variables in Lambda configuration.
- CloudWatch logs.

Later production upgrade:

- Put inbound webhook events into SQS first.
- Process SQS messages with Lambda.
- Store idempotency keys and short conversation history in DynamoDB.
- Store secrets in AWS Systems Manager Parameter Store or Secrets Manager.

## Environment Variables

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Paid OpenAI API key from the OpenAI dashboard. |
| `OPENAI_MODEL` | Defaults to `gpt-5.5`. Use a smaller model if you prefer lower cost. |
| `WHATSAPP_ACCESS_TOKEN` | Meta token allowed to send WhatsApp messages. |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID shown in WhatsApp API setup. |
| `WHATSAPP_VERIFY_TOKEN` | Your own random secret used by Meta webhook verification. |
| `WHATSAPP_APP_SECRET` | Optional Meta app secret for webhook signature verification. |
| `DRY_RUN` | If `true`, logs replies without sending WhatsApp messages. |
| `AUTO_REPLY` | If `false`, receives webhooks but does not generate/send replies. |
| `HUMAN_REVIEW_NUMBERS` | Sender numbers that should not get AI-generated replies. |

## Useful Commands

```bash
npm test
npm run check
npm start
```

## Project Files

- `src/index.js` - local HTTP server entrypoint.
- `src/lambda.js` - AWS Lambda handler.
- `src/app.js` - webhook processing flow.
- `src/agent/persona.js` - tone and behavior prompt.
- `src/agent/replyAgent.js` - OpenAI Responses API call.
- `src/whatsapp/webhook.js` - Meta webhook parsing.
- `src/whatsapp/client.js` - WhatsApp Cloud API sender.
- `docs/IPHONE_TARUS_SCREEN_RECORDING_DEMO.md` - 30-60 second iPhone-style Tarus demo.
- `docs/IPHONE_TARUS_HINDI_BAKCHODI_DEMO.md` - 30-60 second Hindi/Hinglish Tarus demo.
- `docs/assets/iphone13-tarus-realtime-demo.gif` - animated iPhone 13 WhatsApp-style demo.
- `docs/assets/iphone13-tarus-realtime-demo.mov` - generated screen recording video.
- `docs/assets/iphone13-tarus-realtime-demo.m4v` - generated shareable video.
- `docs/assets/iphone13-tarus-realtime-poster.png` - static preview for the demo.
- `docs/assets/iphone13-tarus-hindi-bakchodi-demo.gif` - animated Hindi/Hinglish demo.
- `docs/assets/iphone13-tarus-hindi-bakchodi-demo.mov` - generated Hindi/Hinglish screen recording video.
- `docs/assets/iphone13-tarus-hindi-bakchodi-demo.m4v` - generated Hindi/Hinglish shareable video.
- `docs/assets/iphone13-tarus-hindi-bakchodi-poster.png` - static Hindi/Hinglish preview.
- `docs/VISUAL_OVERVIEW.md` - visual explanation of how the app works.
- `docs/assets/whatsapp-agent-flow.svg` - README workflow image.
- `docs/REALTIME_EXAMPLES.md` - real-time individual and group behavior examples.
- `docs/assets/realtime-individual-normal.svg` - individual normal chat example image.
- `docs/assets/realtime-individual-sensitive.svg` - individual sensitive chat example image.
- `docs/assets/realtime-group-behavior.svg` - group behavior example image.
- `docs/PRD.md` - step-by-step product plan.
- `docs/SETUP.md` - account, key, and deployment setup.
- `docs/LOCAL_RUN_GUIDE.md` - exact local commands for running and testing.
- `docs/META_WHATSAPP_CREDENTIALS.md` - where to get WhatsApp token, verify token, and phone number ID.
- `docs/USE_CASES.md` - plain-English app description and step-by-step use cases.
- `docs/NGROK_GUIDE.md` - why ngrok is used and how to start it.
- `docs/AWS_DEPLOYMENT.md` - complete AWS Lambda and API Gateway deployment steps.
- `docs/ARCHITECT_LOCAL_DEPLOYMENT_GUIDE.md` - best users, OS-specific local setup, and deployment path.
- `docs/assets/audience-fit.svg` - best-fit user image.
- `docs/assets/cross-platform-local-setup.png` - macOS, Windows, Linux setup image for README preview.
- `docs/assets/cross-platform-local-setup.svg` - editable macOS, Windows, Linux setup image source.
- `docs/assets/local-to-cloud-path.svg` - local-to-AWS deployment image.

## Compliance Notes

Use this for a real business number and compliant support or communication workflows. Keep human takeover available, avoid medical/legal/financial decisions, and review WhatsApp Business Platform terms before production use.
