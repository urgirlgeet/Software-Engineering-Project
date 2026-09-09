# Week 04

## Date

23 - 29 August

## Contribution

- Implemented the GATED landing page and applied the reference UI style across the main authentication and onboarding screens.
- Developed the signup workflow covering resident details, society selection, role selection, apartment or staff details, and account completion.
- Connected the signup and login workflow with Supabase authentication while keeping the existing database structure and relationships unchanged.
- Updated the resident dashboard to display profile information, society details, complaints, maintenance requests, notices, bookings, and resident actions.
- Added a shared complaint and maintenance request workflow with subject, category, priority, description, and submission controls.
- Connected complaint submissions to the existing `complaints` table and maintenance submissions to the existing `maintenance_requests` table.
- Added admin verification handling through the existing `society_admin_requests` table and created the pending approval screen.
- Checked the routing between public pages, signup steps, role dashboards, request forms, and approval screens.
- Adjusted frontend queries to remain compatible with existing Supabase relationships, including the `users.apartment_id` and `apartments` relationship.
- Validated the updated screens and routes through TypeScript diagnostics and Expo web exports.
