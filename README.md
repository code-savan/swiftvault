# OTPNaija - Virtual Phone Number Platform

A complete MVP for a virtual phone number / OTP platform targeted at Nigerian users. Users can buy temporary numbers for OTP verification on global services and upgrade to "Echo" — a persistent number with SMS forwarding.

## Features

- 🔐 **Authentication**: Supabase Auth with email/password
- 💰 **Wallet System**: NGN wallet funding via Paystack
- 📱 **One-Time OTP**: VirtualSMS API integration for disposable numbers
- 🔔 **Echo Numbers**: Twilio persistent numbers with SMS forwarding
- 🎁 **Referral System**: Influencer codes with discounts and commissions
- 👨‍💼 **Admin Dashboard**: Complete management interface
- 📊 **Real-time Updates**: Supabase realtime for live OTP delivery

## Tech Stack

- **Frontend**: Next.js 14 with App Router, Tailwind CSS
- **Backend**: Next.js Server Actions & API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Paystack (NGN)
- **SMS Services**: VirtualSMS API & Twilio

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# VirtualSMS
VIRTUAL_SMS_API_KEY=your_virtualsms_api_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Admin User ID (your Supabase user UUID)
ADMIN_USER_ID=your_admin_user_uuid

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
3. This will create all necessary tables, policies, and triggers

### 4. Get Your API Keys

#### Supabase
- Go to your project settings in Supabase
- Copy the Project URL and anon key
- Copy the service_role key (keep this secret!)

#### Paystack
- Sign up at [paystack.com](https://paystack.com)
- Get your test keys from Settings > API Keys & Webhooks
- Set up webhook URL: `https://yourdomain.com/api/paystack/webhook`

#### VirtualSMS
- Sign up at [virtualsms.de](https://virtualsms.de)
- Get your API key from your profile

#### Twilio
- Sign up at [twilio.com](https://twilio.com)
- Get your Account SID and Auth Token from the console
- Buy a phone number with SMS capabilities
- Set webhook URL: `https://yourdomain.com/api/twilio/webhook`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
otpapp/
├── app/
│   ├── (auth)/                 # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected routes
│   │   ├── dashboard/          # User dashboard
│   │   └── admin/              # Admin pages
│   ├── actions/                # Server actions
│   ├── api/                    # API routes
│   ├── components/             # React components
│   ├── lib/                    # Utilities & integrations
│   └── types/                  # TypeScript types
├── supabase/
│   └── schema.sql              # Database schema
└── middleware.ts               # Route protection
```

## Key Features Explained

### User Dashboard
- **Wallet**: Fund via Paystack, view balance
- **Buy OTP**: Select country/service, apply referral code, purchase number
- **Real-time OTP**: Automatic polling for incoming codes
- **Echo Numbers**: View persistent numbers and messages

### Admin Dashboard
- **Overview**: Revenue, users, sales statistics
- **Influencers**: Manage referral codes and commissions
- **Transactions**: View all platform transactions
- **Users**: Search and manage user accounts
- **Echo**: Monitor all active Twilio numbers
- **Referrals**: Create new influencer codes

### Referral System
- Influencers get unique codes (e.g., JAY30)
- Users get discount on purchases
- Influencers earn commission on sales
- Tracked in real-time

## Admin Access

After creating your account:
1. Get your user ID from Supabase Auth dashboard
2. Add it to `.env.local` as `ADMIN_USER_ID`
3. Restart the dev server
4. Access `/admin` routes

## Pricing Configuration

Edit service prices in `app/lib/virtualsms.ts`:

```typescript
export const SERVICES = {
  whatsapp: { code: 'wa', name: 'WhatsApp', price: 3900 },
  amazon: { code: 'am', name: 'Amazon', price: 7000 },
  // Add more services...
}
```

Echo costs are configured in `app/lib/twilio.ts`.

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Important: Update URLs
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Update Paystack webhook URL in Paystack dashboard
- Update Twilio webhook URL in Twilio console

## Support

For issues or questions, please refer to the documentation of:
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Paystack](https://paystack.com/docs)
- [VirtualSMS](https://virtualsms.de)
- [Twilio](https://www.twilio.com/docs)

## License

MIT License - feel free to use this for your own projects!
