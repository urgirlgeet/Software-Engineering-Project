CREATE TABLE public.apartment_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 100),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 2000),
  priority text NOT NULL DEFAULT 'General'
    CHECK (priority IN ('General', 'Important', 'Urgent')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX apartment_notices_society_created_at_idx
  ON public.apartment_notices (society_id, created_at DESC);

ALTER TABLE public.apartment_notices ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.apartment_notices TO authenticated;

CREATE POLICY apartment_notices_read_society
  ON public.apartment_notices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.society_id = apartment_notices.society_id
    )
  );

CREATE POLICY apartment_notices_publish_admin
  ON public.apartment_notices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.id = apartment_notices.author_id
        AND profile.society_id = apartment_notices.society_id
        AND profile.role = 'admin'
    )
  );

CREATE POLICY apartment_notices_delete_admin
  ON public.apartment_notices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.society_id = apartment_notices.society_id
        AND profile.role = 'admin'
    )
  );

CREATE TABLE public.facility_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  facility text NOT NULL CHECK (
    facility IN (
      'Gym',
      'Clubhouse',
      'Swimming Pool',
      'Community Hall',
      'Tennis Court'
    )
  ),
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'BOOKED'
    CHECK (status IN ('BOOKED', 'CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_at > start_at)
);

CREATE INDEX facility_reservations_society_start_idx
  ON public.facility_reservations (society_id, start_at);

CREATE INDEX facility_reservations_resident_start_idx
  ON public.facility_reservations (resident_id, start_at);

ALTER TABLE public.facility_reservations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.facility_reservations TO authenticated;

CREATE POLICY facility_reservations_read_own_or_admin
  ON public.facility_reservations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.society_id = facility_reservations.society_id
        AND (
          (profile.role = 'resident' AND profile.id = facility_reservations.resident_id)
          OR profile.role = 'admin'
        )
    )
  );

CREATE POLICY facility_reservations_create_own
  ON public.facility_reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'BOOKED'
    AND EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.id = facility_reservations.resident_id
        AND profile.society_id = facility_reservations.society_id
        AND profile.role = 'resident'
    )
  );

CREATE OR REPLACE FUNCTION public.guard_facility_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'BOOKED' THEN
    IF NEW.start_at <= statement_timestamp() THEN
      RAISE EXCEPTION 'Choose a future start time.';
    END IF;

    PERFORM pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        NEW.society_id::text || ':' || NEW.facility,
        0
      )
    );

    IF EXISTS (
      SELECT 1
      FROM public.facility_reservations AS existing
      WHERE existing.society_id = NEW.society_id
        AND existing.facility = NEW.facility
        AND existing.status = 'BOOKED'
        AND existing.id IS DISTINCT FROM NEW.id
        AND existing.start_at < NEW.end_at
        AND existing.end_at > NEW.start_at
    ) THEN
      RAISE EXCEPTION 'This facility is already booked during that time.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER facility_reservations_guard_before_write
  BEFORE INSERT OR UPDATE OF facility, start_at, end_at, status
  ON public.facility_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_facility_reservation();

CREATE OR REPLACE FUNCTION public.cancel_facility_reservation(
  p_reservation_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id uuid;
  actor_society_id uuid;
  actor_role text;
BEGIN
  SELECT profile.id, profile.society_id, profile.role
  INTO actor_id, actor_society_id, actor_role
  FROM public.users AS profile
  WHERE profile.auth_user_id = auth.uid();

  IF actor_id IS NULL THEN
    RAISE EXCEPTION 'Your account profile could not be found.';
  END IF;

  IF actor_role IS DISTINCT FROM 'resident'
    AND actor_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'You are not allowed to cancel facility reservations.';
  END IF;

  UPDATE public.facility_reservations
  SET status = 'CANCELLED'
  WHERE id = p_reservation_id
    AND society_id = actor_society_id
    AND status = 'BOOKED'
    AND (
      actor_role = 'admin'
      OR resident_id = actor_id
    );

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found or already cancelled.';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_facility_reservation()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_facility_reservation(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_facility_reservation(uuid)
  TO authenticated;

CREATE TABLE public.maintenance_bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  apartment_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE RESTRICT,
  apartment_number text NOT NULL,
  created_by uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title text NOT NULL DEFAULT 'Maintenance dues'
    CHECK (char_length(trim(title)) BETWEEN 1 AND 100),
  billing_month date NOT NULL CHECK (EXTRACT(DAY FROM billing_month) = 1),
  due_date date NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PAID')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (apartment_id, billing_month)
);

CREATE INDEX maintenance_bills_society_created_idx
  ON public.maintenance_bills (society_id, created_at DESC);

CREATE INDEX maintenance_bills_apartment_month_idx
  ON public.maintenance_bills (apartment_id, billing_month DESC);

ALTER TABLE public.maintenance_bills ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.maintenance_bills TO authenticated;

CREATE POLICY maintenance_bills_read_own_or_admin
  ON public.maintenance_bills
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.society_id = maintenance_bills.society_id
        AND (
          (profile.role = 'resident' AND profile.apartment_id = maintenance_bills.apartment_id)
          OR profile.role = 'admin'
        )
    )
  );

CREATE POLICY maintenance_bills_create_admin
  ON public.maintenance_bills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'PENDING'
    AND EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.id = maintenance_bills.created_by
        AND profile.society_id = maintenance_bills.society_id
        AND profile.role = 'admin'
    )
  );

CREATE POLICY maintenance_bills_delete_admin
  ON public.maintenance_bills
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.users AS profile
      WHERE profile.auth_user_id = auth.uid()
        AND profile.society_id = maintenance_bills.society_id
        AND profile.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.guard_maintenance_bill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  apartment_society_id uuid;
  actual_apartment_number text;
BEGIN
  SELECT apartment.society_id, apartment.flat_number
  INTO apartment_society_id, actual_apartment_number
  FROM public.apartments AS apartment
  WHERE apartment.id = NEW.apartment_id;

  IF apartment_society_id IS NULL
    OR apartment_society_id <> NEW.society_id
    OR actual_apartment_number <> NEW.apartment_number THEN
    RAISE EXCEPTION 'The selected apartment does not belong to this society.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER maintenance_bills_guard_before_insert
  BEFORE INSERT
  ON public.maintenance_bills
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_maintenance_bill();

CREATE OR REPLACE FUNCTION public.create_maintenance_bill(
  p_flat_number text,
  p_billing_month date,
  p_due_date date,
  p_amount numeric
)
RETURNS public.maintenance_bills
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id uuid;
  actor_society_id uuid;
  actor_role text;
  matching_apartments integer;
  target_apartment_id uuid;
  target_flat_number text;
  created_bill public.maintenance_bills;
BEGIN
  SELECT profile.id, profile.society_id, profile.role
  INTO actor_id, actor_society_id, actor_role
  FROM public.users AS profile
  WHERE profile.auth_user_id = auth.uid();

  IF actor_id IS NULL OR actor_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only administrators can create maintenance bills.';
  END IF;

  SELECT count(*)
  INTO matching_apartments
  FROM public.apartments AS apartment
  WHERE apartment.society_id = actor_society_id
    AND lower(trim(apartment.flat_number)) = lower(trim(p_flat_number));

  IF matching_apartments = 0 THEN
    RAISE EXCEPTION 'The apartment number was not found in your society.';
  ELSIF matching_apartments > 1 THEN
    RAISE EXCEPTION 'The apartment number is ambiguous in your society.';
  END IF;

  SELECT apartment.id, apartment.flat_number
  INTO target_apartment_id, target_flat_number
  FROM public.apartments AS apartment
  WHERE apartment.society_id = actor_society_id
    AND lower(trim(apartment.flat_number)) = lower(trim(p_flat_number));

  INSERT INTO public.maintenance_bills (
    society_id,
    apartment_id,
    apartment_number,
    created_by,
    billing_month,
    due_date,
    amount
  )
  VALUES (
    actor_society_id,
    target_apartment_id,
    target_flat_number,
    actor_id,
    p_billing_month,
    p_due_date,
    p_amount
  )
  RETURNING * INTO created_bill;

  RETURN created_bill;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_maintenance_bill_payment(
  p_bill_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id uuid;
  actor_society_id uuid;
  actor_apartment_id uuid;
  actor_role text;
BEGIN
  SELECT profile.id, profile.society_id, profile.apartment_id, profile.role
  INTO actor_id, actor_society_id, actor_apartment_id, actor_role
  FROM public.users AS profile
  WHERE profile.auth_user_id = auth.uid();

  IF actor_id IS NULL OR actor_role IS DISTINCT FROM 'resident' THEN
    RAISE EXCEPTION 'Only residents can record bill payments.';
  END IF;

  UPDATE public.maintenance_bills
  SET status = 'PAID'
  WHERE id = p_bill_id
    AND society_id = actor_society_id
    AND apartment_id = actor_apartment_id
    AND status = 'PENDING';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bill not found, or it has already been paid.';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_maintenance_bill()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_maintenance_bill(text, date, date, numeric)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_maintenance_bill_payment(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_maintenance_bill(text, date, date, numeric)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_maintenance_bill_payment(uuid)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_resident_self_signup()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF new.raw_user_meta_data ->> 'role' = 'resident' THEN
    RETURN new;
  END IF;

  IF coalesce(new.raw_user_meta_data ->> 'role', '') NOT IN (
      'admin',
      'security',
      'maintenance'
    )
    OR new.raw_app_meta_data ->> 'provisioned_by_admin' IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION
      'Signups must be residents or provisioned through the trusted admin API.';
  END IF;

  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_resident_self_signup()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER auth_users_require_resident_role
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_resident_self_signup();

NOTIFY pgrst, 'reload schema';
