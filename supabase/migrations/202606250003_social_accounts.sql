CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'standard',
  email TEXT,
  password TEXT,
  details JSONB DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'suspended')),
  buyer_id TEXT REFERENCES public.users(id),
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social accounts viewable by everyone"
  ON public.social_accounts FOR SELECT
  USING (true);

CREATE POLICY "Social accounts insertable by admins"
  ON public.social_accounts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Social accounts updatable by admins"
  ON public.social_accounts FOR UPDATE
  USING (true);

CREATE POLICY "Social accounts deletable by admins"
  ON public.social_accounts FOR DELETE
  USING (true);

CREATE TRIGGER social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_otp_config_updated_at();
