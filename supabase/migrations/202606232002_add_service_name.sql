-- Add service_name column for direct storage (needed for card payment orders
-- where the join to boosting_services may not exist yet)
ALTER TABLE public.boosting_orders
  ADD COLUMN IF NOT EXISTS service_name TEXT;
