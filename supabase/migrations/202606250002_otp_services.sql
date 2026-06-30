-- OTP services visibility and price overrides
CREATE TABLE IF NOT EXISTS public.otp_services (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  custom_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.otp_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OTP services viewable by everyone"
  ON public.otp_services FOR SELECT
  USING (true);

CREATE TRIGGER otp_services_updated_at
  BEFORE UPDATE ON public.otp_services
  FOR EACH ROW EXECUTE FUNCTION update_otp_config_updated_at();
