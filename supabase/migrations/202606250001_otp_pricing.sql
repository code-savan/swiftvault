-- OTP pricing tiers (markup applied to raw NGN cost)
CREATE TABLE IF NOT EXISTS public.otp_pricing (
  id SERIAL PRIMARY KEY,
  min_ngn DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_ngn DECIMAL(10,2),
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exchange rate cache (single row, updated by cron/action)
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id SERIAL PRIMARY KEY,
  rate DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default tiers
INSERT INTO public.otp_pricing (min_ngn, max_ngn, multiplier) VALUES
  (0,      3000,   2.0),
  (3000,   NULL,   3.0);

-- Default fallback rate
INSERT INTO public.exchange_rates (rate) VALUES (1600);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_otp_pricing_min ON public.otp_pricing(min_ngn);
CREATE INDEX IF NOT EXISTS idx_otp_pricing_max ON public.otp_pricing(max_ngn);

-- RLS
ALTER TABLE public.otp_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Readable by everyone
CREATE POLICY "OTP pricing viewable by everyone"
  ON public.otp_pricing FOR SELECT
  USING (true);

CREATE POLICY "Exchange rates viewable by everyone"
  ON public.exchange_rates FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_otp_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER otp_pricing_updated_at
  BEFORE UPDATE ON public.otp_pricing
  FOR EACH ROW EXECUTE FUNCTION update_otp_config_updated_at();

CREATE TRIGGER exchange_rates_updated_at
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW EXECUTE FUNCTION update_otp_config_updated_at();
