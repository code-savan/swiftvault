-- Supabase Schema for OTP Platform

-- Users table (Clerk user IDs stored as TEXT, format: user_2abc123)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    full_name TEXT,
    phone_number TEXT,
    username TEXT UNIQUE,
    preferences JSONB DEFAULT '{}'::jsonb,
    referred_by TEXT REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral codes table
CREATE TABLE public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    influencer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    commission_percent INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('topup', 'purchase', 'commission', 'refund')),
    description TEXT,
    referral_code_id UUID REFERENCES public.referral_codes(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    paystack_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OTP requests table
CREATE TABLE public.otp_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    country_code TEXT NOT NULL,
    service TEXT NOT NULL,
    provider_number_id TEXT,
    phone_number TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'failed', 'timeout')),
    otp TEXT,
    amount_paid DECIMAL(10, 2),
    referral_code_id UUID REFERENCES public.referral_codes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Echo numbers table
CREATE TABLE public.echo_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    twilio_sid TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    country TEXT NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    monthly_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Echo messages table (for SMS forwarding)
CREATE TABLE public.echo_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    echo_number_id UUID REFERENCES public.echo_numbers(id) ON DELETE CASCADE,
    from_number TEXT NOT NULL,
    message_body TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_otp_requests_user_id ON public.otp_requests(user_id);
CREATE INDEX idx_otp_requests_status ON public.otp_requests(status);
CREATE INDEX idx_echo_numbers_user_id ON public.echo_numbers(user_id);
CREATE INDEX idx_echo_messages_echo_number_id ON public.echo_messages(echo_number_id);
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.jwt() ->> 'sub' = id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for otp_requests
CREATE POLICY "Users can view own OTP requests" ON public.otp_requests
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own OTP requests" ON public.otp_requests
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for echo_numbers
CREATE POLICY "Users can view own echo numbers" ON public.echo_numbers
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for echo_messages
CREATE POLICY "Users can view messages for their echo numbers" ON public.echo_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.echo_numbers
            WHERE echo_numbers.id = echo_messages.echo_number_id
            AND echo_numbers.user_id = auth.jwt() ->> 'sub'
        )
    );

-- RLS Policies for referral_codes (public read)
CREATE POLICY "Anyone can view active referral codes" ON public.referral_codes
    FOR SELECT USING (active = TRUE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_otp_requests_updated_at BEFORE UPDATE ON public.otp_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_echo_numbers_updated_at BEFORE UPDATE ON public.echo_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NOTE: User profiles are created via Clerk webhook (/api/webhooks/clerk)
-- The old auth.users trigger has been removed since we use Clerk for auth.
