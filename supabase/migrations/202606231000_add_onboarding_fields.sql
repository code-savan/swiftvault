-- Add onboarding/profile fields to public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;

-- Username must be unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- User preferences (notifications, appearance, language)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
