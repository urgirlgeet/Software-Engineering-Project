-- Demo communities and apartment numbers for local signup testing.
-- Replace the sample apartments with the real society registry before launch.

DROP POLICY IF EXISTS societies_signup_registry_read ON public.societies;
GRANT SELECT (id, name, city) ON public.societies TO anon, authenticated;

CREATE POLICY societies_signup_registry_read
  ON public.societies
  FOR SELECT
  TO anon, authenticated
  USING (true);

WITH demo_societies(name, city) AS (
  VALUES
    ('Lakeview Gardens', 'Chandigarh'),
    ('Cedar Grove Residency', 'Jaipur'),
    ('Silver Oak Enclave', 'Ludhiana'),
    ('Sunrise Heights', 'Delhi'),
    ('Maple Crest Apartments', 'Pune')
)
INSERT INTO public.societies (id, name, city, created_at)
SELECT gen_random_uuid(), demo_societies.name, demo_societies.city, now()
FROM demo_societies
WHERE NOT EXISTS (
  SELECT 1
  FROM public.societies existing
  WHERE lower(trim(existing.name)) = lower(trim(demo_societies.name))
    AND lower(trim(existing.city)) = lower(trim(demo_societies.city))
);

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
  FROM public.apartments apartment
  WHERE apartment.society_id = p_society_id
    AND lower(trim(apartment.flat_number)) = lower(trim(p_flat_number))
    AND (
      SELECT count(*)
      FROM public.apartments matching_apartment
      WHERE matching_apartment.society_id = p_society_id
        AND lower(trim(matching_apartment.flat_number)) =
          lower(trim(p_flat_number))
    ) = 1
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_signup_apartment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_signup_apartment(uuid, text)
  TO anon, authenticated;

WITH demo_apartments(flat_number, block_name, floor_number) AS (
  VALUES
    ('A-101', 'A', 1),
    ('A-102', 'A', 1),
    ('B-201', 'B', 2),
    ('B-202', 'B', 2)
)
INSERT INTO public.apartments (
  id,
  society_id,
  flat_number,
  block,
  floor,
  created_at
)
SELECT
  gen_random_uuid(),
  society.id,
  demo_apartments.flat_number,
  demo_apartments.block_name,
  demo_apartments.floor_number,
  now()
FROM public.societies society
CROSS JOIN demo_apartments
WHERE (society.name, society.city) IN (
  ('Lakeview Gardens', 'Chandigarh'),
  ('Cedar Grove Residency', 'Jaipur'),
  ('Silver Oak Enclave', 'Ludhiana'),
  ('Sunrise Heights', 'Delhi'),
  ('Maple Crest Apartments', 'Pune')
)
AND NOT EXISTS (
  SELECT 1
  FROM public.apartments existing
  WHERE existing.society_id = society.id
    AND lower(trim(existing.flat_number)) =
      lower(trim(demo_apartments.flat_number))
);
