-- Migration: Switch from Supabase Auth UUID to Clerk TEXT user IDs
-- Run this in Supabase SQL Editor

-- Drop RLS policies first (needed before altering column types)
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own OTP requests" ON public.otp_requests;
DROP POLICY IF EXISTS "Users can insert own OTP requests" ON public.otp_requests;
DROP POLICY IF EXISTS "Users can view own echo numbers" ON public.echo_numbers;
DROP POLICY IF EXISTS "Users can view messages for their echo numbers" ON public.echo_messages;
DROP POLICY IF EXISTS "Anyone can view active referral codes" ON public.referral_codes;

-- Drop FK constraints from child tables first
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.otp_requests DROP CONSTRAINT IF EXISTS otp_requests_user_id_fkey;
ALTER TABLE public.echo_numbers DROP CONSTRAINT IF EXISTS echo_numbers_user_id_fkey;
ALTER TABLE public.referral_codes DROP CONSTRAINT IF EXISTS referral_codes_influencer_id_fkey;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_referred_by_fkey;

-- Drop the FK to auth.users
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Drop the auth.users trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes DISABLE ROW LEVEL SECURITY;

-- Change public.users.id from UUID to TEXT
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.users ALTER COLUMN referred_by TYPE TEXT;

-- Change FK columns from UUID to TEXT
ALTER TABLE public.transactions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.otp_requests ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.echo_numbers ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.referral_codes ALTER COLUMN influencer_id TYPE TEXT;

-- Re-add FK constraints
ALTER TABLE public.users ADD CONSTRAINT users_referred_by_fkey
  FOREIGN KEY (referred_by) REFERENCES public.users(id);

ALTER TABLE public.referral_codes ADD CONSTRAINT referral_codes_influencer_id_fkey
  FOREIGN KEY (influencer_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.otp_requests ADD CONSTRAINT otp_requests_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.echo_numbers ADD CONSTRAINT echo_numbers_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echo_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Re-create RLS policies using Clerk JWT sub claim
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view own OTP requests" ON public.otp_requests
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own OTP requests" ON public.otp_requests
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view own echo numbers" ON public.echo_numbers
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view messages for their echo numbers" ON public.echo_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.echo_numbers
      WHERE echo_numbers.id = echo_messages.echo_number_id
      AND echo_numbers.user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Anyone can view active referral codes" ON public.referral_codes
  FOR SELECT USING (active = TRUE);
