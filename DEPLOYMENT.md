# Authentication, database, and deployment

Discover Lanka uses Supabase Auth and PostgreSQL. The frontend reads only the Supabase project URL and publishable key. Row-level security is enabled on every user-data table; never expose a Supabase secret or `service_role` key in the browser.

## Create the database

1. Create a Supabase project and copy its project URL and anon/publishable key.
2. In the Supabase Dashboard, open **SQL Editor** and run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql), followed by [`supabase/migrations/002_travel_features.sql`](supabase/migrations/002_travel_features.sql).
3. In **Authentication → URL Configuration**, set the site URL to your deployed domain and add local and production callback URLs to the redirect allow list. Email confirmation can be enabled in **Authentication → Providers → Email**.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for local development. Restart Vite after changing environment values. The app also accepts `VITE_SUPABASE_ANON_KEY` for older setups.

The migrations create protected account, favorites, trip, review, suggestion, and travel-advisory tables. The trip planner can save a named itinerary and create a public read-only share link. Public reviews are shown only after admin moderation; destination suggestions also enter the admin review queue. Active advisories appear on the safety page and should include a source and expiration date.

Favorites sync with the signed-in account and remain available locally while offline. The working trip remains local until its owner creates a share link; that saved itinerary can then be reopened from the account's saved itineraries list. Apply both migrations before enabling cloud features.

## Create the first administrator

1. Register your account through `/login` and complete email confirmation if enabled.
2. In the Supabase SQL Editor, grant the admin role to that existing account:

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('admin@example.com');
```

Replace the email with your own account email. Admin access is checked against the database profile after login. Public sign-up cannot set or change roles. Sign in at `/admin/login` and use `/admin` for the protected admin dashboard.

## Deploy the frontend

The project builds as a static Vite site. On Vercel, select the Vite preset, set the build command to `npm run build`, and the output directory to `dist`. On Netlify, use the same build command and output directory; the included `public/_redirects` handles client-side routes.

### GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and publishes the site on pushes to `main` or `master`. Create a GitHub repository, push this project, then set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Add the repository Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under **Settings → Secrets and variables → Actions → Variables**. The workflow builds the repo-name base path automatically and publishes `404.html` so existing client-side routes continue to load. For a user or organization site repository named `<owner>.github.io`, it uses the domain root instead.

After the first successful deployment, add the Pages URL to Supabase **Authentication → URL Configuration** as the site URL and add it (plus any desired local URLs) to the redirect allow list. The Supabase project URL and publishable key are safe for the browser; never add a service-role key to the site or its build settings.

For any hosting provider, add the two Supabase frontend environment values in the provider's project settings, then redeploy. Also add the production domain to Supabase's site URL and redirect allow list.

For local development, copy `.env.example` to `.env.local`, replace the Supabase placeholders, and run `npm run dev`. Do not commit `.env.local` or any service-role key.
