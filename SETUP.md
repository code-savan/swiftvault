# Complete Setup Guide for OTPNaija

This guide will walk you through setting up the entire OTP platform from scratch.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Paystack account (Nigerian)
- An SMS-Activate account
- A Twilio account

## Step 1: Clone and Install

```bash
cd /path/to/otpapp
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and fill in project details
4. Wait for project to be created

### 2.2 Run Database Schema
1. In your Supabase project, go to "SQL Editor"
2. Open `supabase/schema.sql` from this project
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click "Run"
6. Verify all tables were created in "Database" > "Tables"

### 2.3 Get API Keys
1. Go to "Settings" > "API"
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

## Step 3: Set Up Paystack

### 3.1 Create Account
1. Sign up at [paystack.com](https://paystack.com)
2. Complete business verification
3. Get approved for test mode

### 3.2 Get API Keys
1. Go to Settings > API Keys & Webhooks
2. Copy:
   - Test Secret Key → `PAYSTACK_SECRET_KEY`
   - Test Public Key → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

### 3.3 Set Up Webhook (After Deployment)
1. In Paystack dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Select events: `charge.success`

## Step 4: Set Up VirtualSMS (formerly SMS-Activate)

### 4.1 Create Account
1. Go to [virtualsms.de](https://virtualsms.de)
2. Register and verify email
3. Add funds to your account

### 4.2 Get API Key
1. Go to your profile
2. Copy your API key → `VIRTUAL_SMS_API_KEY`

### 4.3 Test API
You can test in browser:
```
https://api.virtualsms.de/stubs/handler_api?api_key=YOUR_KEY&action=getBalance
```

## Step 5: Set Up Twilio

### 5.1 Create Account
1. Sign up at [twilio.com](https://twilio.com)
2. Verify your email and phone
3. Complete account setup

### 5.2 Get Credentials
1. Go to Console
2. Copy:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`

### 5.3 Buy Phone Number
1. Go to Phone Numbers > Buy a Number
2. Select a number with SMS capabilities
3. Buy the number
4. Copy the number → `TWILIO_PHONE_NUMBER`

### 5.4 Set Up Webhook (After Deployment)
1. Go to your purchased phone number settings
2. Under "Messaging", set:
   - A MESSAGE COMES IN: `https://yourdomain.com/api/twilio/webhook`
   - HTTP POST

## Step 6: Environment Variables

Create `.env.local` file in root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# VirtualSMS
VIRTUAL_SMS_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Admin User ID (leave as is for now, update after first user)
ADMIN_USER_ID=replace_with_your_supabase_user_id

# App URL (change for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 8: Create Admin User

1. Register a new account at `http://localhost:3000/register`
2. After registration, go to Supabase:
   - Authentication > Users
   - Find your user and copy the UUID
3. Update `.env.local`:
   ```bash
   ADMIN_USER_ID=your-user-uuid-here
   ```
4. Restart the dev server
5. Now you can access `/admin` routes

## Step 9: Test the Platform

### Test User Flow
1. Register a new account
2. Fund wallet (test with Paystack test cards)
3. Buy an OTP number
4. Wait for OTP to arrive
5. Upgrade to Echo (optional)

### Test Admin Flow
1. Login with admin account
2. Visit `/admin`
3. Create a referral code at `/admin/referrals`
4. View transactions and users

### Paystack Test Cards
```
Success: 4084084084084081
Decline: 4084080000000408
```

## Step 10: Deploy to Production

### 10.1 Deploy to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Deploy!

### 10.2 Update Webhooks
After deployment, update:

**Paystack:**
- Webhook URL: `https://yourdomain.vercel.app/api/paystack/webhook`

**Twilio:**
- SMS Webhook: `https://yourdomain.vercel.app/api/twilio/webhook`

### 10.3 Switch to Production Keys
When ready for production:
1. Use Paystack live keys (not test)
2. Verify Paystack business account
3. Test all flows thoroughly

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check RLS policies are enabled
- Ensure schema was run successfully

### Payment Not Working
- Check Paystack keys
- Verify webhook URL is accessible
- Check webhook logs in Paystack dashboard

### OTP Not Received
- Verify SMS-Activate API key
- Check balance in SMS-Activate account
- Ensure service and country are available

### Twilio Issues
- Verify phone number is active
- Check webhook URL is set correctly
- Ensure account has sufficient balance

## Support Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Paystack**: https://paystack.com/docs/api
- **SMS-Activate**: https://sms-activate.org/en/api2
- **Twilio**: https://www.twilio.com/docs/usage/api

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Keep `PAYSTACK_SECRET_KEY` secret
- Use environment variables in Vercel, not hardcoded values
- Enable 2FA on all service accounts

## Customization

### Change Service Prices
Edit `app/lib/sms-activate.ts`:
```typescript
export const SERVICES = {
  whatsapp: { code: 'wa', name: 'WhatsApp', price: 3900 },
  // Modify prices here
}
```

### Add More Countries
Edit `app/lib/sms-activate.ts`:
```typescript
export const COUNTRIES = {
  // Add more countries here
}
```

### Modify Echo Pricing
Edit `app/lib/twilio.ts`:
```typescript
export function getEchoCost(country: string): number {
  const costs: Record<string, number> = {
    US: 15000,
    // Modify costs here
  }
  return costs[country] || 10000
}
```

---

**You're all set!** 🎉

If you encounter any issues, double-check all API keys and make sure all services are properly configured.
