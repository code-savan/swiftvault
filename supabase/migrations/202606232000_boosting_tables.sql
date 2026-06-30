-- Boosting services cache (synced from Sizzle Social API)
CREATE TABLE IF NOT EXISTS public.boosting_services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rate DECIMAL(10,4) NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  type TEXT DEFAULT 'default',
  description TEXT,
  dripfeed BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  markup_rate DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Boosting orders placed by users
CREATE TABLE IF NOT EXISTS public.boosting_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES public.boosting_services(id),
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  charge DECIMAL(10,2) NOT NULL,
  sizzle_order_id TEXT,
  status TEXT DEFAULT 'pending',
  start_count INTEGER DEFAULT 0,
  remains INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_boosting_services_category ON public.boosting_services(category);
CREATE INDEX IF NOT EXISTS idx_boosting_services_active ON public.boosting_services(active);
CREATE INDEX IF NOT EXISTS idx_boosting_orders_user_id ON public.boosting_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_boosting_orders_status ON public.boosting_orders(status);
CREATE INDEX IF NOT EXISTS idx_boosting_orders_sizzle_id ON public.boosting_orders(sizzle_order_id);

-- RLS policies
ALTER TABLE public.boosting_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boosting_orders ENABLE ROW LEVEL SECURITY;

-- Services are readable by everyone (public catalog)
CREATE POLICY "Services are viewable by everyone"
  ON public.boosting_services FOR SELECT
  USING (true);

-- Orders are only readable by the owner
CREATE POLICY "Users can view own orders"
  ON public.boosting_orders FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create own orders"
  ON public.boosting_orders FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_boosting_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER boosting_services_updated_at
  BEFORE UPDATE ON public.boosting_services
  FOR EACH ROW EXECUTE FUNCTION update_boosting_updated_at();

CREATE TRIGGER boosting_orders_updated_at
  BEFORE UPDATE ON public.boosting_orders
  FOR EACH ROW EXECUTE FUNCTION update_boosting_updated_at();
