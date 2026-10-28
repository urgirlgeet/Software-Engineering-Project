# GATED — Apartment Tracker

GATED is a residential community management app built with Expo Router, React
Native, and Supabase.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Seed demo societies

The signup flow reads society records from Supabase and checks apartment
numbers against the society registry. To populate sample data, run
[`supabase/seed.sql`](./supabase/seed.sql) in the Supabase SQL Editor. It adds
five sample societies across Chandigarh, Jaipur, Ludhiana, Delhi, and Pune,
plus sample apartment numbers. The script also adds public read access to
society names and cities and an RPC that checks one apartment number without
exposing the full apartment table.

The apartment numbers are demo data; replace them with each community's real
registry before using the app with residents.

## Signup backend setup

Before deploying signup changes, run
[`supabase/migrations/20261028132900_signup_profiles.sql`](./supabase/migrations/20261028132900_signup_profiles.sql)
in the Supabase SQL Editor (or apply it through your Supabase migration
workflow). It adds the apartment lookup RPC and creates the user profile when
an Auth account is created. This server-side creation is needed when email
confirmation is enabled, because an unconfirmed user has no session to insert a
profile from the app. New accounts of every role can sign in without
administrator approval. Email confirmation, if enabled in Supabase Auth, is
still required.

If you already applied this migration before approval-free sign-in was enabled,
run the updated migration again to stop creating pending admin approval
requests for new accounts. Existing request records are left unchanged and no
longer block dashboard access.

If your database already has a trigger on `auth.users` that creates rows in
`public.users`, merge that logic with this migration rather than keeping two
independent profile-creation triggers. Existing Auth accounts that were created
without a matching `public.users` row are not repaired by an insert trigger;
repair or remove those accounts in Supabase Auth before asking those users to
retry signup.

After applying it, populate `societies` and `apartments` with real registry
data. Security and maintenance roles currently allow open self-registration,
as selected for this project; employee IDs are stored but are not checked
against a staff registry. Use restrictive database row-level security policies
for staff-only data and operations. The app does not check administrator
approval status when routing users to their dashboards.
