ALTER TABLE public.boosting_orders
  ADD COLUMN IF NOT EXISTS referral_code_id UUID REFERENCES public.referral_codes(id);

ALTER TABLE public.esim_orders
  ADD COLUMN IF NOT EXISTS referral_code_id UUID REFERENCES public.referral_codes(id);
