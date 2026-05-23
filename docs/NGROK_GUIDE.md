# ngrok Guide for Local WhatsApp Webhook Testing

## What ngrok Is

ngrok creates a public HTTPS URL that forwards traffic to your local machine.

For this project, ngrok is useful because Meta WhatsApp webhooks cannot call:

```text
http://localhost:3000/webhook
```

Meta needs a public HTTPS callback URL. ngrok gives you one temporarily, for example:

```text
https://abc123.ngrok-free.app/webhook
```

That public URL forwards requests to:

```text
http://localhost:3000/webhook
```

## When to Use ngrok

Use ngrok when:

- You are testing on your laptop.
- You want Meta to send webhook events to your local server.
- You have not deployed to AWS yet.
- You want fast debugging with local terminal logs.

Do not use ngrok as the final production deployment. For production, use AWS API Gateway + Lambda.

## Step 1: Install ngrok

Visit:

```text
https://ngrok.com/download
```

Download and install ngrok for your operating system.

On macOS with Homebrew:

```bash
brew install ngrok
```

## Step 2: Create ngrok Account

Visit:

```text
https://dashboard.ngrok.com/signup
```

Create an account and sign in.

## Step 3: Connect Your Auth Token

In the ngrok dashboard, open:

```text
https://dashboard.ngrok.com/get-started/your-authtoken
```

Copy the auth token command. It looks like:

```bash
ngrok config add-authtoken your-ngrok-auth-token
```

Run that command once on your machine.

## Step 4: Start This App Locally

From the project folder:

```bash
cd /Users/akash/Documents/Codex/2026-05-22/write-a-normal-person-are-chatting
npm start
```

The app should run on:

```text
http://localhost:3000
```

Check health in another terminal:

```bash
curl http://localhost:3000/health
```

## Step 5: Start ngrok

Open another terminal and run:

```bash
ngrok http 3000
```

ngrok will show a forwarding URL, similar to:

```text
Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL.

## Step 6: Create Your Meta Callback URL

Add `/webhook` to the ngrok HTTPS URL.

Example:

```text
https://abc123.ngrok-free.app/webhook
```

This is the URL you paste into Meta webhook settings.

## Step 7: Configure Meta Webhook

In Meta for Developers:

1. Go to https://developers.facebook.com/apps/
2. Open your app.
3. Go to **WhatsApp > Configuration** or **Webhooks**.
4. Click **Edit** callback URL.
5. Paste your callback URL:

```text
https://abc123.ngrok-free.app/webhook
```

6. Paste your verify token from `.env`:

```text
WHATSAPP_VERIFY_TOKEN
```

7. Click **Verify and Save**.
8. Subscribe to the WhatsApp `messages` field.

## Step 8: Test Webhook Verification Yourself

Replace the URL and token:

```bash
curl "https://abc123.ngrok-free.app/webhook?hub.mode=subscribe&hub.verify_token=your-token&hub.challenge=hello123"
```

Expected response:

```text
hello123
```

If this works, Meta verification should also work.

## Step 9: Send a WhatsApp Test Message

1. Keep your local app running.
2. Keep ngrok running.
3. Send a WhatsApp message to your test WhatsApp Business number.
4. Watch your local terminal logs.

If `.env` has:

```bash
DRY_RUN=true
```

the app logs the reply but does not send it.

When ready:

```bash
DRY_RUN=false
```

Restart:

```bash
npm start
```

## Important ngrok Notes

- Free ngrok URLs can change when you restart ngrok.
- If the URL changes, update the Meta webhook callback URL.
- The local app and ngrok must both be running.
- Use only the HTTPS ngrok URL in Meta.
- AWS deployment replaces ngrok for production.

## Troubleshooting

### Meta says callback verification failed

Check:

- `npm start` is running.
- `ngrok http 3000` is running.
- The callback URL ends with `/webhook`.
- The verify token in Meta exactly matches `.env`.
- You used the HTTPS ngrok URL, not HTTP.

### Browser shows Not found

This is normal if you open only the root URL:

```text
https://abc123.ngrok-free.app
```

Use:

```text
https://abc123.ngrok-free.app/health
```

or:

```text
https://abc123.ngrok-free.app/webhook
```

### WhatsApp message does not reach local app

Check:

- Meta webhook is subscribed to `messages`.
- You are messaging the correct WhatsApp test number.
- Your recipient number is added and verified in Meta test recipients.
- ngrok URL did not change.
