-- Change default markup_rate from 1.0 (0% markup) to 1.25 (25% markup)
ALTER TABLE public.boosting_services
  ALTER COLUMN markup_rate SET DEFAULT 1.25;

-- Update existing services that still have the old default (1.0)
-- to the new default of 1.25 (25% markup).
-- Services that were already customized are left untouched.
UPDATE public.boosting_services
  SET markup_rate = 1.25
  WHERE markup_rate = 1.0;
