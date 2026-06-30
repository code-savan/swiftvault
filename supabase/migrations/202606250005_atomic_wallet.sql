-- Atomic wallet operations with row-level locking (FOR UPDATE)
-- These prevent race conditions from concurrent wallet operations

CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_user_id TEXT,
  p_amount DECIMAL,
  p_description TEXT DEFAULT '',
  p_reference TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  SELECT wallet_balance INTO v_balance
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_new_balance := v_balance + p_amount;

  UPDATE public.users SET wallet_balance = v_new_balance WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, amount, type, description, status, paystack_reference)
  VALUES (p_user_id, p_amount, 'topup', p_description, 'completed', p_reference);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

CREATE OR REPLACE FUNCTION public.deduct_wallet(
  p_user_id TEXT,
  p_amount DECIMAL,
  p_description TEXT DEFAULT '',
  p_referral_code_id UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  SELECT wallet_balance INTO v_balance
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  IF v_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  v_new_balance := v_balance - p_amount;

  UPDATE public.users SET wallet_balance = v_new_balance WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, amount, type, description, status, referral_code_id)
  VALUES (p_user_id, -p_amount, 'purchase', p_description, 'completed', p_referral_code_id);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

CREATE OR REPLACE FUNCTION public.transfer_commission(
  p_influencer_id TEXT,
  p_amount DECIMAL,
  p_referral_code_id UUID,
  p_description TEXT DEFAULT 'Referral commission'
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  SELECT wallet_balance INTO v_balance
  FROM public.users
  WHERE id = p_influencer_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Influencer not found');
  END IF;

  v_new_balance := v_balance + p_amount;

  UPDATE public.users SET wallet_balance = v_new_balance WHERE id = p_influencer_id;

  INSERT INTO public.transactions (user_id, amount, type, description, status, referral_code_id)
  VALUES (p_influencer_id, p_amount, 'commission', p_description, 'completed', p_referral_code_id);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;
