// Apartment registry format: block letter A-Z and flat number 1-8,
// stored as "<block>-<flat>" (for example "A-1"). The SQL in
// supabase/reset_demo_data.sql creates the same set for every society.

export const apartmentBlocks = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index),
);

export const apartmentFlatNumbers = Array.from({ length: 8 }, (_, index) =>
  String(index + 1),
);

export function formatApartmentNumber(block: string, flat: string) {
  return `${block}-${flat}`;
}
