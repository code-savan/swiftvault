-- eSIM plans cache (synced from ResellPortal API)
CREATE TABLE IF NOT EXISTS public.esim_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  country TEXT,
  region TEXT,
  data_amount TEXT NOT NULL,
  validity TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  plan_type TEXT DEFAULT 'single',
  coverage_countries INTEGER,
  speed TEXT DEFAULT '4G/5G',
  active BOOLEAN DEFAULT true,
  markup_rate DECIMAL(5,2) DEFAULT 1.25,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- eSIM orders placed by users
CREATE TABLE IF NOT EXISTS public.esim_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.esim_plans(id),
  iccid TEXT,
  qr_code TEXT,
  activation_code TEXT,
  charge DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  data_used_mb INTEGER DEFAULT 0,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_esim_plans_country ON public.esim_plans(country);
CREATE INDEX IF NOT EXISTS idx_esim_plans_active ON public.esim_plans(active);
CREATE INDEX IF NOT EXISTS idx_esim_orders_user_id ON public.esim_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_esim_orders_status ON public.esim_orders(status);

-- RLS policies
ALTER TABLE public.esim_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esim_orders ENABLE ROW LEVEL SECURITY;

-- Plans are readable by everyone (public catalog)
CREATE POLICY "eSIM plans are viewable by everyone"
  ON public.esim_plans FOR SELECT
  USING (true);

-- Orders are only readable by the owner
CREATE POLICY "Users can view own eSIM orders"
  ON public.esim_orders FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create own eSIM orders"
  ON public.esim_orders FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_esim_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER esim_plans_updated_at
  BEFORE UPDATE ON public.esim_plans
  FOR EACH ROW EXECUTE FUNCTION update_esim_updated_at();

CREATE TRIGGER esim_orders_updated_at
  BEFORE UPDATE ON public.esim_orders
  FOR EACH ROW EXECUTE FUNCTION update_esim_updated_at();
