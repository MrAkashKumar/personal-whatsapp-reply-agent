# Application Description and Use Cases

## What This Application Is

This application is a WhatsApp Business reply assistant.

It receives incoming WhatsApp messages, understands the message context, writes a warm and natural reply using OpenAI, and sends the reply back through the official WhatsApp Cloud API.

The goal is to make people feel acknowledged quickly when you are busy, sleeping, working, traveling, or unable to reply immediately.

Important: this app is designed for WhatsApp Business Cloud API, not for unofficial automation of a normal personal WhatsApp account.

## Why This Application Is Useful

This application helps you:

- Reply faster to incoming WhatsApp messages.
- Keep a polite and human tone.
- Avoid leaving people ignored.
- Give short replies when a short reply is enough.
- Hold sensitive messages for human review.
- Save time on repeated basic responses.
- Keep communication professional with work contacts.
- Keep communication warm with family, partner, and friends.

## What It Should Not Do

This application should not:

- Make serious decisions for you.
- Send money or promise payment.
- Give medical, legal, or financial advice.
- Reply deeply to emotional conflict without your review.
- Handle OTPs, passwords, bank details, or private credentials.
- Pretend it completed an action that it did not actually complete.

For risky messages, it should reply with a safe acknowledgement like:

```text
I saw this. Let me check properly and reply in a bit.
```

## Step-by-Step Message Flow

1. Someone sends a WhatsApp message to your WhatsApp Business number.
2. Meta WhatsApp Cloud API sends that message to your webhook URL.
3. This app receives the webhook on `/webhook`.
4. The app checks whether the message is valid and not a duplicate.
5. The app checks whether the message is sensitive or needs human review.
6. If it is normal, the app sends the message to OpenAI with your communication style.
7. OpenAI returns a short, natural reply.
8. The app cleans the reply text.
9. If `DRY_RUN=true`, the app only logs the reply for testing.
10. If `DRY_RUN=false`, the app sends the reply back through WhatsApp Cloud API.
11. The sender receives a fast and polite WhatsApp response.

## Use Case 1: Busy Professional

Scenario:

You are in a meeting and someone messages you:

```text
Hey Akash, can we discuss the project today?
```

Possible reply:

```text
Yes, we can. I’m tied up right now, but I’ll message you shortly and we’ll fix a time.
```

Benefit:

The person gets a respectful response without waiting for hours.

## Use Case 2: Friend Chat

Scenario:

A friend messages:

```text
Bro are you coming tonight?
```

Possible reply:

```text
Haha I’ll try. Let me check my timing and tell you in a bit.
```

Benefit:

The reply feels casual and normal, not robotic.

## Use Case 3: Family Message

Scenario:

A family member messages:

```text
Call me when you are free.
```

Possible reply:

```text
I saw your message. I’ll call you as soon as I get a little free.
```

Benefit:

Family feels acknowledged even when you cannot reply deeply.

## Use Case 4: Work Contact

Scenario:

A colleague or client messages:

```text
Can you review this issue?
```

Possible reply:

```text
Thanks for sharing it. I’ll review it properly and get back to you shortly.
```

Benefit:

The tone stays professional and calm.

## Use Case 5: Sensitive Message

Scenario:

Someone messages:

```text
Can you send money urgently?
```

Safe reply:

```text
I saw this. Let me check properly and reply in a bit.
```

Benefit:

The app does not make risky commitments. You can review and reply yourself.

## Use Case 6: After-Hours Acknowledgement

Scenario:

Someone messages late at night:

```text
Need to talk about tomorrow's meeting.
```

Possible reply:

```text
I saw this. I’ll check properly and reply in the morning.
```

Benefit:

The sender knows the message was received.

## Use Case 7: Simple Customer or Lead Reply

Scenario:

A new contact messages your business number:

```text
Hi, I want to know about your service.
```

Possible reply:

```text
Hi, thanks for reaching out. Please send me what you’re looking for, and I’ll guide you properly.
```

Benefit:

You do not miss new leads or business conversations.

## Recommended First Version

Start with this safe setup:

```bash
DRY_RUN=true
AUTO_REPLY=true
```

Test with your own number first. After you trust the replies, change:

```bash
DRY_RUN=false
```

## Best Production Use

Use the app as a first-response assistant, not as a full replacement for you.

Best pattern:

1. App gives quick acknowledgement.
2. App answers simple messages.
3. App holds sensitive messages.
4. You personally reply when the message needs real judgement.

This keeps communication fast, polite, and safe.
