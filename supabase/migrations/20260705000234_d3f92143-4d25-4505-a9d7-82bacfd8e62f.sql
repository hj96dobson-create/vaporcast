
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_normalized text NOT NULL,
  source text NOT NULL DEFAULT 'homepage modal',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  is_founding_vip boolean NOT NULL DEFAULT false,
  discount_tier text NOT NULL DEFAULT 'standard' CHECK (discount_tier IN ('vip','standard')),
  rejection_reason text,
  confirmation_token text UNIQUE,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX waitlist_email_normalized_key ON public.waitlist (email_normalized);
CREATE INDEX waitlist_status_idx ON public.waitlist (status);
CREATE INDEX waitlist_created_at_idx ON public.waitlist (created_at DESC);

GRANT ALL ON public.waitlist TO service_role;

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Admins can read all waitlist rows via the client-side admin page (uses server functions with service role, but policy is here for completeness)
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Atomically confirm a waitlist row; assign VIP if within first 10 confirmed
CREATE OR REPLACE FUNCTION public.confirm_waitlist(_token text)
RETURNS TABLE(id uuid, email text, status text, is_founding_vip boolean, discount_tier text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.waitlist%ROWTYPE;
  _confirmed_count integer;
  _is_vip boolean;
BEGIN
  SELECT * INTO _row FROM public.waitlist WHERE confirmation_token = _token FOR UPDATE;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF _row.status = 'confirmed' THEN
    RETURN QUERY SELECT _row.id, _row.email, _row.status, _row.is_founding_vip, _row.discount_tier;
    RETURN;
  END IF;

  SELECT COUNT(*) INTO _confirmed_count FROM public.waitlist WHERE status = 'confirmed';
  _is_vip := _confirmed_count < 10;

  UPDATE public.waitlist
     SET status = 'confirmed',
         confirmed_at = now(),
         is_founding_vip = _is_vip,
         discount_tier = CASE WHEN _is_vip THEN 'vip' ELSE 'standard' END,
         confirmation_token = NULL
   WHERE id = _row.id
   RETURNING * INTO _row;

  RETURN QUERY SELECT _row.id, _row.email, _row.status, _row.is_founding_vip, _row.discount_tier;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_waitlist(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_waitlist(text) TO service_role;
