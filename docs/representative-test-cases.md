# GATED: Apartment Tracker — Representative Test Cases

These are the key test cases for demonstrating the app. They cover every
role, the full complaint workflow, data privacy between users, and
conflict-free facility booking. The complete list of 92 test cases is in
[test-cases.md](test-cases.md).

## Setup

1. Run [`supabase/reset_demo_data.sql`](../supabase/reset_demo_data.sql) in
   the Supabase SQL Editor.
2. Install the latest APK, or run `npx expo start` and open the app.

All demo accounts belong to **Sunrise Residency** and use the password
**`123456`**.

| Email | Role | Apartment |
| --- | --- | --- |
| admin@test.gmail | Society admin | — |
| maintenance@test.gmail | Maintenance staff | — |
| security@test.gmail | Security guard | — |
| resident@test.gmail | Resident | A-1 |
| resident2@test.gmail | Resident | B-2 |

## Test cases

| # | Test case | Steps | Expected result | Result |
| --- | --- | --- | --- | --- |
| RT-01 | Resident signup with block/flat dropdowns | Sign up a new resident → choose Sunrise Residency → Block **C**, Flat **4** | Account is created and the resident dashboard opens with apartment **C-4** | |
| RT-02 | Signup input checks | Sign up with email `abc@mail`, then a 5-character password, then mismatched passwords | Each attempt shows a clear error and no account is created | |
| RT-03 | Each role lands on its own dashboard | Sign in as admin, maintenance, security and resident | Each account opens a different dashboard | |
| RT-04 | Wrong password is rejected | Sign in as `resident@test.gmail` with password `654321` | "Invalid login credentials"; the user stays on the sign-in screen | |
| RT-05 | Resident cannot open the admin screen | Signed in as resident, go to `/admin-dashboard` | "Access Denied" and the user is sent back to sign-in | |
| RT-06 | Resident raises a complaint | Resident: new complaint "Leaking tap", category Plumbing, priority urgent | Complaint is saved with status **Submitted** and shown on the dashboard | |
| RT-07 | Admin assigns the complaint | Admin: open the complaint → assign to Demo Maintenance | Status changes to **Assigned**; it appears on the maintenance dashboard | |
| RT-08 | Maintenance cannot resolve without a note | Maintenance: **Start Work**, then **Mark Resolved** with an empty note | "Resolution note required" | |
| RT-09 | Full complaint lifecycle | Maintenance adds the note "Replaced washer" → **Mark Resolved** | Resident sees **Resolved** with the note: Submitted → Assigned → In Progress → Resolved | |
| RT-10 | Admin publishes an urgent notice | Admin: notice "Water shutdown tomorrow", priority **Urgent** | Both residents see it on their dashboard and the notice board | |
| RT-11 | Facility booking | `resident@test.gmail` books the Gym tomorrow 10:00–11:00 | "Booking confirmed" | |
| RT-12 | Double booking is blocked | `resident2@test.gmail` books the Gym tomorrow 10:30–11:30 | Rejected: "This facility is already booked during that time." The second resident cannot see the first booking, so the database itself enforces the rule | |
| RT-13 | Admin creates a maintenance bill | Admin: flat **A-1**, next month, amount 2500; then repeat for the same flat and month | First bill is created as **Pending**; the duplicate is rejected | |
| RT-14 | Bills stay private to each flat | Open Bills as `resident@test.gmail` (A-1), then as `resident2@test.gmail` (B-2) | Only the A-1 resident sees the bill | |
| RT-15 | Resident pays the bill | `resident@test.gmail` taps **Record simulated payment** | Status changes to **Paid** and the admin's totals update | |

## Suggested demo order

RT-01 → RT-03 → RT-06 → RT-07 → RT-08 → RT-09 → RT-10 → RT-11 → RT-12 →
RT-13 → RT-14 → RT-15

This follows one story from signup through complaints to billing. Keep
RT-02, RT-04 and RT-05 ready in case validation or security comes up.

The visitor pass screen is not part of the demo: visitor requests are not
saved yet and disappear when the app reloads.
