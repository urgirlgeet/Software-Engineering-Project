-- =====================================================================
-- GATED: Apartment Tracker - schema repair, user reset and demo data
-- =====================================================================
-- Run this whole file once in the Supabase SQL Editor.
--
-- WARNING: this permanently deletes EVERY user account (auth.users and
-- public.users) and all data that belongs to users: complaints,
-- maintenance requests, notices, bookings, bills, visitors, payments,
-- notifications and approval requests. It also replaces every society's
-- apartment list. Societies themselves are kept. This cannot be undone.
--
-- What it does:
--   1. Creates the missing tables for notices, facility bookings and
--      maintenance bills (the "table not found" errors in the app), plus
--      the signup functions and triggers. Safe to run more than once.
--   2. Deletes all users and their data.
--   3. Rebuilds the apartment registry: blocks A-Z with flats 1-8
--      ("A-1" ... "Z-8") for every society, matching the signup dropdowns.
--   4. Creates demo accounts (password 123456 for all):
--        admin@test.gmail        Society admin
--        maintenance@test.gmail  Maintenance staff
--        security@test.gmail     Security guard
--        resident@test.gmail     Resident, flat A-1
--        resident2@test.gmail    Resident, flat B-2
--   5. Stops anonymous visitors from reading the users table.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1a. Signup support (from 20261028132900_signup_profiles.sql)
-- ---------------------------------------------------------------------

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS employee_id text;

GRANT SELECT (id, name, city) ON public.societies TO anon, authenticated;

DROP POLICY IF EXISTS societies_signup_registry_read ON public.societies;
CREATE POLICY societies_signup_registry_read
  ON public.societies
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.lookup_signup_apartment(
  p_society_id uuid,
  p_flat_number text
)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT apartment.id
  FROM public.apartments AS apartment
  WHERE apartment.society_id = p_society_id
    AND lower(trim(apartment.flat_number)) = lower(trim(p_flat_number))
    AND (
      SELECT count(*)
      FROM public.apartments AS matching_apartment
      WHERE matching_apartment.society_id = p_society_id
        AND lower(trim(matching_apartment.flat_number)) =
          lower(trim(p_flat_number))
    ) = 1
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_signup_apartment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_signup_apartment(uuid, text)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_gated_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  signup_role text;
  signup_society_id uuid;
  signup_apartment_id uuid;
  signup_employee_id text;
BEGIN
  signup_role := nullif(trim(new.raw_user_meta_data ->> 'role'), '');

  IF signup_role IS NULL OR signup_role NOT IN (
    'resident',
    'admin',
    'security',
    'maintenance'
  ) THEN
    RAISE EXCEPTION 'Choose a valid account role before signing up.';
  END IF;

  BEGIN
    signup_society_id :=
      nullif(trim(new.raw_user_meta_data ->> 'society_id'), '')::uuid;
  EXCEPTION
    WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'The selected society is invalid.';
  END;

  IF signup_society_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.societies AS society
    WHERE society.id = signup_society_id
  ) THEN
    RAISE EXCEPTION 'The selected society could not be found.';
  END IF;

  IF nullif(trim(new.raw_user_meta_data ->> 'name'), '') IS NULL
    OR nullif(trim(new.raw_user_meta_data ->> 'phone'), '') IS NULL THEN
    RAISE EXCEPTION 'Enter your name and contact number before signing up.';
  END IF;

  signup_apartment_id := NULL;
  signup_employee_id :=
    nullif(trim(new.raw_user_meta_data ->> 'employee_id'), '');

  IF signup_role = 'resident' THEN
    IF nullif(trim(new.raw_user_meta_data ->> 'apartment'), '') IS NULL THEN
      RAISE EXCEPTION 'Enter your apartment number before signing up.';
    END IF;

    signup_apartment_id := public.lookup_signup_apartment(
      signup_society_id,
      trim(new.raw_user_meta_data ->> 'apartment')
    );

    IF signup_apartment_id IS NULL THEN
      RAISE EXCEPTION
        'Apartment number was not found or is ambiguous in this society.';
    END IF;
  ELSIF signup_employee_id IS NULL THEN
    RAISE EXCEPTION 'Enter your employee ID before signing up.';
  END IF;

  INSERT INTO public.users (
    id,
    auth_user_id,
    name,
    email,
    phone,
    society_id,
    role,
    apartment_id,
    employee_id
  )
  VALUES (
    new.id,
    new.id,
    trim(new.raw_user_meta_data ->> 'name'),
    new.email,
    trim(new.raw_user_meta_data ->> 'phone'),
    signup_society_id,
    signup_role,
    signup_apartment_id,
    signup_employee_id
  )
  ON CONFLICT (id) DO UPDATE
  SET
    auth_user_id = EXCLUDED.auth_user_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    society_id = EXCLUDED.society_id,
    role = EXCLUDED.role,
    apartment_id = EXCLUDED.apartment_id,
    employee_id = EXCLUDED.employee_id;

  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_gated_signup() FROM PUBLIC, anon,
  authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_gated ON auth.users;
CREATE TRIGGER on_auth_user_created_gated
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_gated_signup();

-- Only residents may sign up from the app. Staff accounts must carry
-- app_metadata.provisioned_by_admin = true (set by the admin API or below).
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

DROP TRIGGER IF EXISTS auth_users_require_resident_role ON auth.users;
CREATE TRIGGER auth_users_require_resident_role
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_resident_self_signup();

-- ---------------------------------------------------------------------
-- 1b. Notices, facility bookings and maintenance bills
--     (from 20261124120000_apartment_services.sql)
-- ---------------------------------------------------------------------

-- Notices ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.apartment_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 100),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 2000),
  priority text NOT NULL DEFAULT 'General'
    CHECK (priority IN ('General', 'Important', 'Urgent')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apartment_notices_society_created_at_idx
  ON public.apartment_notices (society_id, created_at DESC);

ALTER TABLE public.apartment_notices ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.apartment_notices TO authenticated;

DROP POLICY IF EXISTS apartment_notices_read_society ON public.apartment_notices;
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

DROP POLICY IF EXISTS apartment_notices_publish_admin ON public.apartment_notices;
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

DROP POLICY IF EXISTS apartment_notices_delete_admin ON public.apartment_notices;
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

-- Facility bookings --------------------------------------------------

CREATE TABLE IF NOT EXISTS public.facility_reservations (
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

CREATE INDEX IF NOT EXISTS facility_reservations_society_start_idx
  ON public.facility_reservations (society_id, start_at);

CREATE INDEX IF NOT EXISTS facility_reservations_resident_start_idx
  ON public.facility_reservations (resident_id, start_at);

ALTER TABLE public.facility_reservations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.facility_reservations TO authenticated;

DROP POLICY IF EXISTS facility_reservations_read_own_or_admin
  ON public.facility_reservations;
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

DROP POLICY IF EXISTS facility_reservations_create_own
  ON public.facility_reservations;
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

DROP TRIGGER IF EXISTS facility_reservations_guard_before_write
  ON public.facility_reservations;
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

-- Maintenance bills --------------------------------------------------

CREATE TABLE IF NOT EXISTS public.maintenance_bills (
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

CREATE INDEX IF NOT EXISTS maintenance_bills_society_created_idx
  ON public.maintenance_bills (society_id, created_at DESC);

CREATE INDEX IF NOT EXISTS maintenance_bills_apartment_month_idx
  ON public.maintenance_bills (apartment_id, billing_month DESC);

ALTER TABLE public.maintenance_bills ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.maintenance_bills TO authenticated;

DROP POLICY IF EXISTS maintenance_bills_read_own_or_admin
  ON public.maintenance_bills;
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

DROP POLICY IF EXISTS maintenance_bills_create_admin ON public.maintenance_bills;
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

DROP POLICY IF EXISTS maintenance_bills_delete_admin ON public.maintenance_bills;
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

DROP TRIGGER IF EXISTS maintenance_bills_guard_before_insert
  ON public.maintenance_bills;
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

-- ---------------------------------------------------------------------
-- 2. Delete all users and the data that belongs to them
-- ---------------------------------------------------------------------
-- Child tables are emptied before the tables they point to. Tables that
-- do not exist in this database are skipped.

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'notifications',
    'emergency_requests',
    'payments',
    'amenity_bookings',
    'security_logs',
    'visitor_requests',
    'visitors',
    'notices',
    'society_admin_requests',
    'complaints',
    'maintenance_requests',
    'maintenance_bills',
    'facility_reservations',
    'apartment_notices',
    'residents',
    'security_staff',
    'maintenance_staff',
    'society_admins',
    'users'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DELETE FROM public.%I', table_name);
    END IF;
  END LOOP;
END;
$$;

-- Removes every login. Sessions, identities and refresh tokens are
-- deleted with them.
DELETE FROM auth.users;

-- ---------------------------------------------------------------------
-- 3. Apartment registry: blocks A-Z, flats 1-8, for every society
-- ---------------------------------------------------------------------

DELETE FROM public.apartments;

INSERT INTO public.apartments (id, society_id, flat_number, block, floor, created_at)
SELECT
  gen_random_uuid(),
  society.id,
  chr(64 + block_index) || '-' || flat_index,
  chr(64 + block_index),
  NULL,
  now()
FROM public.societies AS society
CROSS JOIN generate_series(1, 26) AS block_index
CROSS JOIN generate_series(1, 8) AS flat_index;

-- ---------------------------------------------------------------------
-- 4. Demo accounts (password: 123456)
-- ---------------------------------------------------------------------
-- All demo accounts belong to one society: "Sunrise Residency" if it
-- exists, otherwise the first society alphabetically. Change the name in
-- demo_society_name below to use a different society.

CREATE FUNCTION pg_temp.create_demo_user(
  p_email text,
  p_name text,
  p_phone text,
  p_role text,
  p_society_id uuid,
  p_apartment text,
  p_employee_id text
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change,
    email_change_token_new,
    email_change_token_current,
    reauthentication_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    p_email,
    extensions.crypt('123456', extensions.gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', jsonb_build_array('email'),
      'provisioned_by_admin', p_role <> 'resident'
    ),
    jsonb_strip_nulls(jsonb_build_object(
      'name', p_name,
      'phone', p_phone,
      'role', p_role,
      'society_id', p_society_id::text,
      'apartment', p_apartment,
      'employee_id', p_employee_id
    )),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    new_user_id,
    new_user_id::text,
    'email',
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', p_email,
      'email_verified', true
    ),
    now(),
    now(),
    now()
  );
END;
$$;

DO $$
DECLARE
  demo_society_name text := 'Sunrise Residency';
  demo_society_id uuid;
BEGIN
  SELECT id INTO demo_society_id
  FROM public.societies
  WHERE name = demo_society_name
  LIMIT 1;

  IF demo_society_id IS NULL THEN
    SELECT id INTO demo_society_id
    FROM public.societies
    ORDER BY name
    LIMIT 1;
  END IF;

  IF demo_society_id IS NULL THEN
    RAISE EXCEPTION 'Add at least one society before creating demo users.';
  END IF;

  -- The signup trigger creates each public.users profile automatically.
  PERFORM pg_temp.create_demo_user('admin@test.gmail', 'Demo Admin',
    '9000000001', 'admin', demo_society_id, NULL, 'ADM-001');
  PERFORM pg_temp.create_demo_user('maintenance@test.gmail', 'Demo Maintenance',
    '9000000002', 'maintenance', demo_society_id, NULL, 'MNT-001');
  PERFORM pg_temp.create_demo_user('security@test.gmail', 'Demo Security',
    '9000000003', 'security', demo_society_id, NULL, 'SEC-001');
  PERFORM pg_temp.create_demo_user('resident@test.gmail', 'Demo Resident',
    '9000000004', 'resident', demo_society_id, 'A-1', NULL);
  PERFORM pg_temp.create_demo_user('resident2@test.gmail', 'Demo Resident Two',
    '9000000005', 'resident', demo_society_id, 'B-2', NULL);
END;
$$;

-- ---------------------------------------------------------------------
-- 5. Protect the users table
-- ---------------------------------------------------------------------
-- Signed-out visitors could read every profile (names, emails, phones).
-- Now only signed-in users can read profiles, and only within their own
-- society. Profiles are written only by the signup trigger.

CREATE OR REPLACE FUNCTION public.current_profile_society_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT profile.society_id
  FROM public.users AS profile
  WHERE profile.auth_user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_profile_society_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_profile_society_id() TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.users', policy_name);
  END LOOP;
END;
$$;

REVOKE ALL ON public.users FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.users FROM authenticated;
GRANT SELECT ON public.users TO authenticated;

CREATE POLICY users_read_same_society
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR society_id = public.current_profile_society_id()
  );

NOTIFY pgrst, 'reload schema';

COMMIT;

-- ---------------------------------------------------------------------
-- Check the result: five demo accounts with their society and flat
-- ---------------------------------------------------------------------

SELECT
  profile.email,
  profile.role,
  society.name AS society,
  apartment.flat_number AS apartment,
  profile.employee_id
FROM public.users AS profile
JOIN public.societies AS society ON society.id = profile.society_id
LEFT JOIN public.apartments AS apartment ON apartment.id = profile.apartment_id
ORDER BY profile.role, profile.email;
