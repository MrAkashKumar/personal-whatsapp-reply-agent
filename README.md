# Personal WhatsApp Reply Agent

A small, maintainable starter repo for a WhatsApp Business Cloud API webhook that replies in a warm, natural, concise style using OpenAI.

Important: this project is for the official WhatsApp Business Platform / Cloud API with a business phone number. WhatsApp does not provide an official API for automating a normal personal WhatsApp account.

## Documentation Map

Use this section to jump to the right guide.

| Need | Document |
| --- | --- |
| Senior architect guide: best users, local setup, OS commands, deployment path | [Architect local/deployment guide](docs/ARCHITECT_LOCAL_DEPLOYMENT_GUIDE.md) |
| See the visual workflow image | [Visual overview](docs/VISUAL_OVERVIEW.md) |
| See real-time individual and group examples | [Real-time examples](docs/REALTIME_EXAMPLES.md) |
| Understand what this app does | [Use cases](docs/USE_CASES.md) |
| Product requirements and roadmap | [PRD](docs/PRD.md) |
| Run the project locally | [Local run guide](docs/LOCAL_RUN_GUIDE.md) |
| Test WhatsApp webhooks locally with ngrok | [ngrok guide](docs/NGROK_GUIDE.md) |
| Create Meta WhatsApp token, verify token, and phone number ID | [Meta WhatsApp credentials](docs/META_WHATSAPP_CREDENTIALS.md) |
| Deploy to AWS Lambda and API Gateway | [AWS deployment guide](docs/AWS_DEPLOYMENT.md) |
| General setup notes | [Setup guide](docs/SETUP.md) |

## What This Does

- Receives inbound WhatsApp webhook events.
- Verifies Meta webhook setup with a custom verify token.
- Optionally verifies `X-Hub-Signature-256` using your Meta app secret.
- Generates short, human-sounding replies with OpenAI's Responses API.
- Sends replies through the WhatsApp Cloud API.
- Uses careful fallback replies when the message needs human attention.
- Runs locally with Node.js or as an AWS Lambda handler.

## Real-Time Examples

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

![Cross-platform local setup](docs/assets/cross-platform-local-setup.svg)

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
- `docs/assets/cross-platform-local-setup.svg` - macOS, Windows, Linux setup image.
- `docs/assets/local-to-cloud-path.svg` - local-to-AWS deployment image.

## Compliance Notes

Use this for a real business number and compliant support or communication workflows. Keep human takeover available, avoid medical/legal/financial decisions, and review WhatsApp Business Platform terms before production use.
