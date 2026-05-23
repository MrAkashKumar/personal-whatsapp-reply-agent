# Meta WhatsApp Credentials Guide

This guide explains where to create or find:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`

## Websites to Visit

Use these official Meta/WhatsApp websites:

- Meta for Developers: https://developers.facebook.com/
- Your Meta apps: https://developers.facebook.com/apps/
- WhatsApp Developer Hub: https://whatsappbusiness.com/developers/developer-hub/
- Meta Business Suite: https://business.facebook.com/
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- Access Token Debugger: https://developers.facebook.com/tools/debug/accesstoken/

## Step 1: Create Meta Developer Account

1. Go to https://developers.facebook.com/
2. Log in with your Facebook account.
3. Complete developer account registration if Meta asks.

## Step 2: Create a Meta App

1. Go to https://developers.facebook.com/apps/
2. Click **Create App**.
3. Choose a business/business messaging app type if Meta asks.
4. Create or select your Meta Business Portfolio.
5. Finish creating the app.

## Step 3: Add WhatsApp Product

1. Open your app in Meta for Developers.
2. In the left menu, find **Add product**.
3. Add **WhatsApp**.
4. Open **WhatsApp > API Setup** or **WhatsApp > Getting Started**.

Meta may create a test WhatsApp number and WhatsApp Business Account for you during this flow.

## Step 4: Get Temporary Access Token

Use this first for testing.

1. Open your Meta app.
2. Go to **WhatsApp > API Setup** or **WhatsApp > Getting Started**.
3. Copy the **Temporary access token**.
4. Paste it into `.env`:

```bash
WHATSAPP_ACCESS_TOKEN=your-temporary-access-token
```

Temporary tokens expire. They are okay for testing, not production.

## Step 5: Get Phone Number ID

In the same **WhatsApp > API Setup** page, find:

- Test number
- Phone number ID
- WhatsApp Business Account ID

Copy **Phone number ID** into `.env`:

```bash
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

Important: this is not the visible phone number. It is Meta's internal ID for that WhatsApp sender number.

## Step 6: Add a Test Recipient Number

For test mode, Meta only sends messages to verified recipient numbers.

1. In **WhatsApp > API Setup**, find the recipient/to phone number area.
2. Add your personal phone number as a test recipient.
3. Meta will send a verification code.
4. Enter the code in the dashboard.

Now your app can send test messages to your phone.

## Step 7: Create Verify Token

You create this yourself. Meta does not generate it.

Example:

```bash
openssl rand -hex 32
```

Copy the generated value into `.env`:

```bash
WHATSAPP_VERIFY_TOKEN=your-random-long-secret
```

You will paste the same value into Meta when setting up the webhook.

## Step 8: Configure Webhook

First run the local app:

```bash
npm start
```

Expose it with ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS ngrok URL.

In Meta:

1. Open your app.
2. Go to **WhatsApp > Configuration** or **Webhooks**.
3. Click **Edit** for callback URL.
4. Callback URL:

```text
https://your-ngrok-url/webhook
```

5. Verify token:

```text
same value as WHATSAPP_VERIFY_TOKEN
```

6. Click **Verify and Save**.
7. Subscribe to the WhatsApp **messages** webhook field.

If verification fails, check:

- Your local app is running.
- ngrok is running.
- The callback URL ends with `/webhook`.
- The verify token matches exactly.
- Your server returns the `hub.challenge` value.

This project already handles that in `src/whatsapp/webhook.js`.

## Step 9: Get App Secret

This is optional for local testing but recommended.

1. Open your app in Meta for Developers.
2. Go to **App settings > Basic**.
3. Find **App secret**.
4. Click show/copy.
5. Put it in `.env`:

```bash
WHATSAPP_APP_SECRET=your-meta-app-secret
```

This lets the server verify that webhook calls came from Meta.

## Step 10: Create a Permanent Token for Production

Do this after temporary token testing works.

1. Go to https://business.facebook.com/
2. Open **Business settings**.
3. Go to **Users > System users**.
4. Create a system user.
5. Assign assets:
   - your Meta app
   - your WhatsApp Business Account
6. Generate a token for your app.
7. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
8. Copy the token immediately and store it safely.
9. Replace `WHATSAPP_ACCESS_TOKEN` in `.env` or AWS Lambda environment variables.

For production, store this token in AWS Systems Manager Parameter Store or AWS Secrets Manager instead of plain text.

## Step 11: Add Your Real Business Phone Number

For MVP testing, use Meta's test number first.

For a real number:

1. Go to Meta Business Suite or WhatsApp Manager.
2. Open your WhatsApp Business Account.
3. Go to **Phone numbers**.
4. Click **Add phone number**.
5. Enter business display name and phone number.
6. Verify using SMS or voice call.
7. After verification, copy the new **Phone number ID**.
8. Update:

```bash
WHATSAPP_PHONE_NUMBER_ID=your-real-phone-number-id
```

Important:

- The phone number should be able to receive SMS or voice calls.
- A normal WhatsApp/WhatsApp Business app number may need to be removed or migrated before Cloud API registration.
- Your display name may need Meta review before production messaging.

## Final `.env` Example

```bash
PORT=3000
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-5.5

WHATSAPP_ACCESS_TOKEN=your-meta-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-random-verify-token
WHATSAPP_APP_SECRET=your-meta-app-secret

DRY_RUN=true
AUTO_REPLY=true
```

Start with `DRY_RUN=true`. Change to `DRY_RUN=false` only after webhook testing works.
