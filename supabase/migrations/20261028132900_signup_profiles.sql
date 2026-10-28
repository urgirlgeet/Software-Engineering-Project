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

NOTIFY pgrst, 'reload schema';
