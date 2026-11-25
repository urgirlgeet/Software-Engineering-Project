# GATED: Apartment Tracker — Test Cases

This document lists the functional, validation, integration, and security test
cases for GATED: Apartment Tracker. The primary requirements source is the SRS
(`Software_Requirements_Specification/srs.tex`); the final report
(`projectreport/final_report.tex`) is used for additional features that were
added after the SRS. The traceability matrix below identifies the SRS
sub-requirements and known implementation gaps.

**How to use this document:** run each case against the app (Expo Go, emulator,
or `npx expo start --web`) connected to a Supabase project with both migrations
and `supabase/seed.sql` applied. Record the outcome in the **Result** column as
`Pass`, `Fail`, or `Blocked`, and add the defect in the notes if it fails.
Cases marked *Known limitation* describe behaviour that is expected to fail
until the feature is completed.

## Test environment

| Item | Value |
| --- | --- |
| Client | Expo SDK 57, React Native 0.86, Expo Router (Android, iOS, web) |
| Backend | Supabase (Auth, PostgreSQL, Row Level Security, RPC functions) |
| Seed data | 5 societies (Lakeview Gardens, Cedar Grove Residency, Silver Oak Enclave, Sunrise Heights, Maple Crest Apartments); flats `A-101`, `A-102`, `B-201`, `B-202` |
| Test accounts | R1 = resident of Lakeview Gardens, flat A-101; R2 = resident of Lakeview Gardens, flat A-102; R3 = resident of Cedar Grove Residency; AD = admin of Lakeview Gardens; MS = maintenance staff of Lakeview Gardens; SG = security guard of Lakeview Gardens. Staff accounts are created through the Supabase Admin API with `app_metadata.provisioned_by_admin = true`. |

## Requirement IDs

| ID | Requirement |
| --- | --- |
| FR-1 | Users can register and sign in securely |
| FR-2 | Users are routed to a dashboard based on their role |
| FR-3 | Residents can raise complaints and maintenance requests and track their status |
| FR-4 | Administrators can view society complaints and assign them to maintenance staff |
| FR-5 | Maintenance staff can view assigned complaints and update their status |
| FR-6 | Administrators can publish notices that residents of the same society can read |
| FR-7 | Residents can book facilities without double booking |
| FR-8 | Administrators can generate maintenance bills; residents can view and pay them |
| FR-9 | Residents can request visitor passes and security can manage entry |
| NFR-1 | Data is restricted by role and society (Row Level Security) |
| NFR-2 | The application builds and runs on mobile and web |

## SRS traceability

| SRS requirement | Related cases | Coverage / known gap |
| --- | --- | --- |
| FR-1.1: Registration fields and password rules | TC-01–08, TC-17–20 | Field validation, password length, signup and confirmation flows |
| FR-1.2: Choose one of four roles | TC-08, TC-21, TC-25 | Role selection and role-based routing; verify role choices against the SRS |
| FR-1.3: Resident apartment belongs to selected society | TC-09–10, TC-14–17 | Registry lookup, invalid flat, normalization and successful signup |
| FR-1.4 / BR-3: New admin requests remain pending until approved | TC-21 | Requirement is not implemented: admin signup/approval state is not enforced by the current signup flow |
| FR-2.1: Resident dashboard data | TC-25, TC-34, TC-36, TC-52, TC-59, TC-74, TC-86 | Dashboard/profile data and workflow updates |
| FR-2.2–2.3: Complaint and maintenance request form and required fields | TC-32–37 | Form validation, categories, priority, description, submission and resident ownership |
| FR-3.1–3.3: Society complaint listing and assignment | TC-38–41 | Society-scoped listing, staff selection and assigned status |
| FR-4.1–4.2: Staff assignment scope and status updates | TC-42–48 | Assigned-work visibility, status progression, resolution note and lifecycle |
| FR-5.1–5.2: Visitor entry and exit logs | TC-82–85 | Partial only: current visitor screen uses in-memory requests; persisted gate entry/exit logs are not implemented |
| FR-6: Technology stack | TC-88–90 | Type check and platform build/run checks; version/configuration can also be inspected in `package.json` |
| NFR: 500 ms API response and 2 s startup targets | TC-91 | Measurement is defined but not recorded; requires a representative network/device |
| NFR: Concurrency and society isolation | TC-53, TC-61–64 | Cross-society visibility and concurrent facility booking |
| NFR: Authentication, session storage and role isolation | TC-21–31, TC-54, TC-67–68, TC-79–81 | Auth, routing, RLS and role checks; secure-storage requirement needs a separate verification |
| NFR: Maintainability, usability and reliability | TC-01–20, TC-32–35, TC-56–58, TC-69–73, TC-88 | Validation, typed build and database-backed constraints |
| BR-1: Resident belongs to one society and apartment | TC-14–17 | Signup registry and profile association |
| BR-2: Assignment stays within the complaint's society | TC-38, TC-40–42 | Society-scoped staff assignment |
| BR-4: No overlapping facility bookings | TC-59–68 | Boundary, cross-resident and concurrency cases |

The notices, facility-booking, and billing cases also cover final-report
features. They extend beyond the detailed feature list in this SRS and are
retained so the delivered application is tested as well as the original
requirements.

---

## 1. Registration (FR-1)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | All signup fields empty | App on Sign Up screen | Tap **Continue** with every field empty | Alert "Please fill in all fields." Stays on Sign Up | Validation | |
| TC-02 | Invalid email format | Sign Up screen | Email = `abc@mail`, other fields valid | Alert "Invalid email — Enter a valid email address." | Validation | |
| TC-03 | Phone number too short | Sign Up screen | Phone = `12345` (5 digits) | Alert "Invalid phone number" | Validation | |
| TC-04 | Phone number too long | Sign Up screen | Phone = `1234567890123456` (16 digits) | Alert "Invalid phone number" | Validation (boundary) | |
| TC-05 | Phone number with formatting | Sign Up screen | Phone = `+91 98765-43210` | Accepted (12 digits after removing non-digits) and user moves to society selection | Validation (boundary) | |
| TC-06 | Passwords do not match | Sign Up screen | Password `secret12`, Confirm `secret13` | Alert "Passwords do not match." | Validation | |
| TC-07 | Password shorter than 6 characters | Sign Up screen | Password and Confirm = `abc12` | Alert "Password must be at least 6 characters." | Validation (boundary) | |
| TC-08 | Valid signup details | Sign Up screen | Name `Test Resident`, valid email, phone `9876543210`, password `secret12` twice | User moves to the society selection screen | Functional | |
| TC-09 | Society list loads | Seed data applied | Open society selection | All 5 seeded societies are listed with their city | Integration | |
| TC-10 | No society selected | Society screen | Tap **Continue** without selecting | Alert "Please choose your society." | Validation | |
| TC-11 | Society not listed | Society screen | Select "society not listed", tap **Continue** | Contact screen opens | Functional | |
| TC-12 | Contact form incomplete | Contact screen | Leave Message empty, submit | Alert "Please fill in all fields." | Validation | |
| TC-13 | Contact form complete | Contact screen | Fill name, email, society, message, submit | Alert "Request Submitted", then Sign In screen. *Known limitation: the request is not stored or sent anywhere.* | Functional | |
| TC-14 | Apartment number empty | Details screen (resident) | Leave apartment empty, tap **Continue** | Alert "Please enter your apartment number." | Validation | |
| TC-15 | Apartment not in registry | Lakeview Gardens selected | Apartment = `Z-999` | Error "That apartment number was not found in this society…" No Auth account is created | Validation / Integration | |
| TC-16 | Apartment match ignores case and spaces | Lakeview Gardens selected | Apartment = `  a-101 ` | Apartment is accepted (lookup uses `lower(trim())`) and account is linked to flat A-101 | Validation (boundary) | |
| TC-17 | Successful resident signup (email confirmation off) | New email address | Complete all steps with apartment `A-101` | Resident dashboard opens. `public.users` has a row with role `resident`, correct `society_id` and `apartment_id` | Functional / Integration | |
| TC-18 | Successful signup (email confirmation on) | Email confirmation enabled in Supabase Auth | Complete signup | Screen tells the user to confirm the email; dashboard does not open until confirmed and signed in | Functional | |
| TC-19 | Duplicate email | Email already registered | Complete signup with the same email | Error message from Supabase; no second profile is created | Validation | |
| TC-20 | Signup details expire on reload | Reach the apartment step | Reload the app (web refresh) then continue | "Your signup details expired. Please start again." (password is held in memory only, by design) | Functional / Security | |
| TC-21 | New admin signup remains pending | Fresh admin signup | Register a Society Admin and attempt to use admin functions before approval | Account is pending and cannot perform admin actions until an existing admin approves it (FR-1.4, BR-3). **Known gap:** current signup flow does not enforce this pending/approval workflow; record the observed result as Fail if the account becomes operational. | Functional / Security | |

## 2. Sign in, routing and sign out (FR-1, FR-2)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-22 | Empty credentials | Sign In screen | Tap **Sign In** with empty fields | Alert "Please enter your email and password." | Validation | |
| TC-23 | Wrong password | R1 exists | R1 email, password `wrongpass` | Alert "Sign In Failed" with "Invalid login credentials" | Functional / Security | |
| TC-24 | Email with surrounding spaces | R1 exists | Email = `  r1@example.com  `, correct password | Sign in succeeds (email is trimmed) | Validation | |
| TC-25 | Role-based routing | Accounts R1, AD, MS, SG | Sign in with each account | R1 → Resident dashboard, AD → Admin dashboard, MS → Maintenance dashboard, SG → Security dashboard | Functional | |
| TC-26 | Auth account without profile | Auth user with no `public.users` row | Sign in | Alert "User profile not found." Dashboard does not open | Functional | |
| TC-27 | Session is remembered | R1 signed in | Close and reopen the app | Resident dashboard opens without asking for a password | Functional | |
| TC-28 | Stale session without profile | Signed in, then profile row deleted | Reopen app | User is signed out and sent to Sign In | Security | |
| TC-29 | Sign out | R1 signed in | Open navigation, tap **Sign out** | Sign In screen opens; reopening the app does not restore the session | Functional | |
| TC-30 | Resident opens admin dashboard by URL | R1 signed in (web) | Go to `/admin-dashboard` | Alert "Access Denied", redirected to Sign In | Security (NFR-1) | |
| TC-31 | Resident opens maintenance or security dashboard by URL | R1 signed in (web) | Go to `/maintenance-dashboard`, then `/security-dashboard` | Access is refused and the user is redirected to Sign In | Security (NFR-1) | |

## 3. Complaints and maintenance requests (FR-3, FR-4, FR-5)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-32 | Complaint with missing subject | R1 signed in, New Complaint screen | Leave subject empty, pick category, add description | Alert "Incomplete request" | Validation | |
| TC-33 | Complaint with whitespace-only description | New Complaint screen | Description = `"   "` | Alert "Incomplete request" | Validation (boundary) | |
| TC-34 | Valid complaint | R1 signed in | Subject `Leaking tap`, category `Plumbing`, priority `urgent`, description added | "Complaint submitted". Row in `complaints` with status `submitted`, R1's `user_id` and society. Complaint appears on R1's dashboard | Functional / Integration | |
| TC-35 | Valid maintenance request | R1 signed in | Open Maintenance Request, fill all fields | "Maintenance request submitted". Row stored in `maintenance_requests` | Functional / Integration | |
| TC-36 | Resident views own request | TC-34 done | Tap the complaint on the dashboard | Read-only details show title, category, priority, status, description and dates | Functional | |
| TC-37 | Resident cannot view another resident's request | R2's complaint ID known | R1 opens `/request?id=<R2 complaint id>` | "This request could not be found." (query is limited to R1's `user_id`) | Security (NFR-1) | |
| TC-38 | Admin sees society complaints only | Complaints exist in Lakeview Gardens and Cedar Grove | AD opens Complaints | Only Lakeview Gardens complaints are listed; count matches | Functional / Security | |
| TC-39 | Assign without choosing staff | AD on a complaint | Open Assign, confirm without selecting | Alert "Required — Select a maintenance employee." | Validation | |
| TC-40 | Assign complaint to maintenance staff | AD signed in, MS exists in the same society | Assign TC-34 complaint to MS | "Complaint Assigned to <MS name>". Status becomes `assigned`, `assigned_to` = MS | Functional / Integration | |
| TC-41 | Staff list is society scoped | Maintenance staff exist in two societies | AD opens Assign | Only maintenance staff of Lakeview Gardens are listed | Security | |
| TC-42 | Maintenance sees only assigned complaints | TC-40 done; other complaints unassigned | MS opens dashboard | Only complaints with `assigned_to = MS` are shown | Functional / Security | |
| TC-43 | Start work | MS on an `assigned` complaint | Tap **Start Work** | Status changes to `in_progress`; resident sees "In progress" | Functional | |
| TC-44 | Resolve without resolution note | Complaint is `in_progress` | Tap **Mark Resolved** with empty note | Alert "Resolution note required" | Validation | |
| TC-45 | Resolve with note | Complaint is `in_progress` | Note `Replaced washer`, tap **Mark Resolved** | Status `resolved`, `resolution_note` and `resolved_at` saved. Resident sees status and note | Functional / Integration | |
| TC-46 | Maintenance cannot update an unassigned complaint | Complaint assigned to another staff member | MS tries to change its status | Update is refused ("The complaint was not updated.") | Security (NFR-1) | |
| TC-47 | Resident cannot open staff complaint screen | R1 signed in | Go to `/complaint-details?id=<id>` | Alert "Access Denied", redirected to Sign In | Security | |
| TC-48 | End-to-end complaint lifecycle | R1, AD, MS | Submit → assign → start work → resolve | Status passes through submitted → assigned → in_progress → resolved and each actor sees the current status | Integration / System | |

## 4. Notice board (FR-6)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-49 | Publish empty notice | AD signed in | Tap **Publish** with empty title and body | Alert "Notice details required" | Validation | |
| TC-50 | Title length limit | AD signed in | Type 101 characters in the title | Input stops at 100 characters (`maxLength`); database check also limits to 100 | Validation (boundary) | |
| TC-51 | Publish urgent notice | AD signed in | Title `Water shutdown`, body text, priority `Urgent` | Notice appears at the top with the Urgent label | Functional | |
| TC-52 | Residents of the same society see the notice | TC-51 done | R1 opens Notices and the dashboard | Notice is visible to R1 | Integration | |
| TC-53 | Residents of another society do not see it | TC-51 done | R3 opens Notices | Notice is not listed | Security (NFR-1) | |
| TC-54 | Resident cannot publish | R1 signed in | Open Notices; also try a direct insert with R1's session | No publish form for R1; direct insert is rejected by RLS | Security | |
| TC-55 | Admin deletes a notice | TC-51 done | AD deletes the notice and confirms | Notice disappears for AD and R1 | Functional | |

## 5. Facility booking (FR-7)

Times are entered as `YYYY-MM-DDTHH:mm` in local time.

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-56 | Wrong time format | R1 on Facility booking | Start = `25/12/2026 10:00` | Alert "Booking times required — Enter both times in YYYY-MM-DDTHH:mm format." | Validation | |
| TC-57 | Start time in the past | R1 | Start = yesterday 10:00, end = yesterday 11:00 | Alert "Invalid booking time" | Validation | |
| TC-58 | End before start | R1 | Start = tomorrow 11:00, end = tomorrow 10:00 | Alert "Invalid booking time" | Validation | |
| TC-59 | Valid booking | R1 | Gym, tomorrow 10:00–11:00 | "Booking confirmed". Row in `facility_reservations` with status `BOOKED` | Functional | |
| TC-60 | Overlap with own booking | TC-59 done | R1 books Gym tomorrow 10:30–11:30 | Alert "Time unavailable" (checked in the app) | Functional | |
| TC-61 | Overlap with another resident's booking | TC-59 done | R2 books Gym tomorrow 10:30–11:30 | Booking refused with "This facility is already booked during that time." (checked by the database trigger, since R2 cannot see R1's bookings) | Integration / Security | |
| TC-62 | Back-to-back booking allowed | TC-59 done | R2 books Gym tomorrow 11:00–12:00 | Booking confirmed (end time equal to the next start time is not an overlap) | Boundary | |
| TC-63 | Same time, different facility | TC-59 done | R2 books Clubhouse tomorrow 10:00–11:00 | Booking confirmed | Functional | |
| TC-64 | Simultaneous requests for the same slot | Two devices | R1 and R2 submit Tennis Court at the same slot at the same moment | Exactly one booking succeeds (advisory lock in the trigger) | Concurrency | |
| TC-65 | Cancel own booking | TC-59 done | R1 cancels the Gym booking | Status `CANCELLED`; the slot can be booked again | Functional | |
| TC-66 | Cancel an already cancelled booking | TC-65 done | Call `cancel_facility_reservation` again for the same ID | "Reservation not found or already cancelled." | Validation | |
| TC-67 | Resident cannot cancel someone else's booking | R2 has a booking | R1 calls `cancel_facility_reservation` with R2's booking ID | Refused with "Reservation not found or already cancelled." | Security | |
| TC-68 | Only residents can book | AD signed in | AD opens Facility booking and tries to book | Alert "Not allowed — Only residents can book facilities." AD can see all society bookings | Security | |

## 6. Maintenance billing (FR-8)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-69 | Missing bill details | AD on Bills | Leave flat number empty | Alert "Bill details required" | Validation | |
| TC-70 | Invalid billing month | AD | Month = `2026-13` | Alert "Bill details required" | Validation (boundary) | |
| TC-71 | Invalid due date | AD | Due date = `2026-02-30` | Alert "Bill details required" | Validation (boundary) | |
| TC-72 | Amount zero, negative or text | AD | Amount = `0`, then `-500`, then `abc` | Alert "Invalid amount — Enter an amount greater than zero." for each | Validation (boundary) | |
| TC-73 | Flat not in society | AD | Flat = `Z-999` | "The apartment number was not found in your society." | Validation / Integration | |
| TC-74 | Create valid bill | AD | Flat `A-101`, month `2026-12`, due `2026-12-10`, amount `2500` | "Bill created". Row has status `PENDING`; outstanding total rises by 2500 | Functional | |
| TC-75 | Duplicate bill for the same month | TC-74 done | Create another bill for `A-101`, `2026-12` | Refused (one bill per flat per billing month) | Validation | |
| TC-76 | Resident sees own flat's bill only | TC-74 done | R1 (A-101) and R2 (A-102) open Bills | R1 sees the bill; R2 does not | Security (NFR-1) | |
| TC-77 | Resident records payment | TC-74 done | R1 taps **Record simulated payment** on the bill | Status becomes `PAID`; outstanding and collected totals update. No real money is moved | Functional | |
| TC-78 | Pay an already paid bill | TC-77 done | Call `record_maintenance_bill_payment` again | "Bill not found, or it has already been paid." | Validation | |
| TC-79 | Admin cannot mark a bill paid | AD signed in | AD calls `record_maintenance_bill_payment` | "Only residents can record bill payments." | Security | |
| TC-80 | Non-admin cannot create bills | R1 signed in | R1 calls `create_maintenance_bill` | "Only administrators can create maintenance bills." | Security | |
| TC-81 | Staff without billing access | MS or SG signed in | Open `/bills` | "Your account is not set up to view these bills." | Security | |

## 7. Visitor management (FR-9)

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-82 | Visitor pass with missing details | Visitors screen | Leave phone empty, submit | Alert "Missing details" | Validation | |
| TC-83 | Request a visitor pass | Visitors screen | Name `Aman`, phone `9876500000`, purpose `Delivery` | Alert "Visitor pass requested"; new entry with status Pending at the top of the list | Functional | |
| TC-84 | Visitor pass is saved | TC-83 done | Reload the app and reopen Visitors | Request is still listed and visible to security. *Known limitation: requests are held in screen state only and are lost on reload; no QR pass is generated.* | Integration | |
| TC-85 | Security dashboard tiles | SG signed in | Tap Visitors, Deliveries, Gate activity, Residents, Emergency, Notices | Each tile opens its screen. *Known limitation: Deliveries, Gate activity, Residents and Emergency routes do not exist yet.* | Functional | |

## 8. Profile and navigation

| ID | Scenario | Pre-conditions | Steps / Test data | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-86 | Profile details | R1 signed in | Open **My profile** | Name, email, phone, apartment (A-101) and society (Lakeview Gardens) are shown | Functional | |
| TC-87 | Role-based navigation menu | R1 and AD signed in | Open the navigation menu for each | Resident and admin see Home, Complaints, Notice board, Facility booking, Maintenance bills, My profile; maintenance sees Home, Complaints, Notice board, My maintenance team, My profile; security has no Complaints item | Functional | |

## 9. Non-functional and build checks (NFR-2)

| ID | Scenario | Steps | Expected result | Type | Result |
| --- | --- | --- | --- | --- | --- |
| TC-88 | TypeScript type check | `npx tsc --noEmit` | No type errors | Static analysis | Pass (run 25 Nov 2026) |
| TC-89 | Web build | `npx expo export --platform web` | Static web build completes without errors | Build | Pass (run 25 Nov 2026; 25 routes exported) |
| TC-90 | Android run | `npx expo start`, open in Expo Go | App launches to Sign In; flows in sections 1–6 work | Compatibility | |
| TC-91 | API response and dashboard startup targets | Sign in as R1 on a representative 4G/5G/Wi-Fi connection; record timings | Supabase calls complete within 500 ms and the authenticated dashboard is displayed within 2 seconds, as specified by the SRS. Record device, network and timings. | Performance | |
| TC-92 | No secret keys in client | Search the source for a service-role key | Only the Supabase publishable (anon) key is present | Security | Pass (run 25 Nov 2026; no server-role key pattern in `src/`) |

## Summary

| Module | Test cases |
| --- | --- |
| Registration | TC-01 – TC-21 (21) |
| Sign in, routing, sign out | TC-22 – TC-31 (10) |
| Complaints and maintenance | TC-32 – TC-48 (17) |
| Notice board | TC-49 – TC-55 (7) |
| Facility booking | TC-56 – TC-68 (13) |
| Maintenance billing | TC-69 – TC-81 (13) |
| Visitor management | TC-82 – TC-85 (4) |
| Profile and navigation | TC-86 – TC-87 (2) |
| Non-functional | TC-88 – TC-92 (5) |
| **Total** | **92** |
