# Setup Guide

## Step 1: Create Accounts

Create or prepare:

- OpenAI API account with billing enabled.
- Meta for Developers account.
- Meta Business Portfolio.
- WhatsApp Business Account.
- A phone number for WhatsApp Business Platform.
- AWS account for deployment.

Important: do not use a phone number that is currently active in a normal WhatsApp app unless you understand Meta's migration/registration requirements.

## Step 2: Create OpenAI API Key

1. Go to the OpenAI API dashboard.
2. Create a project for this WhatsApp agent.
3. Create an API key.
4. Put the key in `.env` locally:

```bash
OPENAI_API_KEY=sk-your-key
```

5. In AWS, store it as a Lambda environment variable first for MVP. For production, move it to AWS Systems Manager Parameter Store or Secrets Manager.

## Step 3: Create WhatsApp Business Cloud API App

1. Go to Meta for Developers.
2. Create an app.
3. Add the WhatsApp product.
4. Open WhatsApp API setup.
5. Copy:
   - temporary or permanent access token
   - phone number ID
   - WhatsApp Business Account ID
6. Add your test recipient number in the Meta dashboard while testing.

Put these into `.env`:

```bash
WHATSAPP_ACCESS_TOKEN=your-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-own-random-token
```

## Step 4: Configure Local Webhook

1. Start the local service:

```bash
npm start
```

2. Create a public tunnel:

```bash
ngrok http 3000
```

3. In Meta webhook configuration:
   - Callback URL: `https://your-ngrok-url/webhook`
   - Verify token: same as `WHATSAPP_VERIFY_TOKEN`
4. Subscribe to WhatsApp `messages` events.

## Step 5: Test Dry Run

Keep:

```bash
DRY_RUN=true
```

Send a test WhatsApp message to your Cloud API test number. The app should log the generated reply but not send it.

## Step 6: Enable Sending

After dry-run looks good:

```bash
DRY_RUN=false
```

Restart the server and test with one allowed number.

## Step 7: Deploy to AWS

MVP deployment path:

1. Create a Lambda function using Node.js 20 or newer.
2. Zip this repo and upload it, or connect CI/CD later.
3. Set Lambda handler:

```text
src/lambda.handler
```

4. Add environment variables from `.env`.
5. Create API Gateway HTTP API.
6. Route:

```text
ANY /webhook -> Lambda
GET /health -> Lambda
```

7. Use the API Gateway URL as your Meta webhook callback URL:

```text
https://your-api-id.execute-api.region.amazonaws.com/webhook
```

## Step 8: Cost Control

In AWS:

- Create a billing budget.
- Create a billing alarm.
- Avoid NAT Gateway.
- Avoid EC2 for the MVP.
- Keep logs retention short, such as 7 or 14 days.

In OpenAI:

- Set a monthly project budget if available.
- Start with low output tokens.
- Keep replies short.

## Step 9: Production Checklist

- `DRY_RUN=false` only after testing.
- `WHATSAPP_APP_SECRET` set for signature verification.
- Human review list configured.
- CloudWatch alarm on Lambda errors.
- Duplicate message handling moved from memory to DynamoDB.
- Webhook processing moved to SQS if traffic grows.
- WhatsApp policy reviewed for your exact use case.
