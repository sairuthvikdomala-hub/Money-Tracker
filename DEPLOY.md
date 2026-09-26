# Nivesh on Vercel

This is the Vercel-ready version of your money tracker: the login/API
logic runs as serverless functions in `/api`, and `index.html` is served
as the static frontend — both from the same project, same domain.

The one real change from the local version: Vercel functions don't keep a
local disk between requests, so this uses **Vercel Postgres** (built on
Neon) instead of the `db.json` file. Everything else — the UI, the
accounts/transactions/people model, delete buttons — is identical.

## Deploy — dashboard method (no CLI needed)

1. **Push this folder to a GitHub repo** (create a new repo, e.g.
   `nivesh`, and push everything in this folder to it).
2. **Go to [vercel.com/new](https://vercel.com/new)** and import that
   repo. Leave the framework preset as "Other" — no build command is
   needed, Vercel will detect `/api` and the static `index.html`
   automatically. Click **Deploy**.
3. **Add a Postgres database:** in your new project on Vercel, open the
   **Storage** tab → **Create Database** → **Postgres**. Connect it to
   this project. Vercel automatically adds the `POSTGRES_URL` (and
   related) environment variables for you — nothing to copy/paste.
4. **Set a real login secret:** in the project's **Settings → Environment
   Variables**, add:
   - `JWT_SECRET` = any long random string (e.g. generate one with
     `openssl rand -hex 32` on your machine)
5. **Redeploy** (Settings → Deployments → ⋯ → Redeploy) so the new env
   vars take effect.
6. Open your `*.vercel.app` URL, sign up, and you're in. The first
   request creates the database tables automatically.

## Deploy — CLI method

```bash
npm i -g vercel
cd nivesh-vercel
vercel        # follow the prompts to link/create the project, deploys a preview
vercel --prod # promote to your production URL
```

Then still do steps 3–5 above from the Vercel dashboard (attaching
Postgres and setting `JWT_SECRET` isn't scriptable from a fresh CLI run
without your account's specifics, so the dashboard is the reliable way).

## Making changes after deploy

- Edit `index.html` for anything UI-related.
- Edit the matching file under `api/` for backend/data changes — each
  resource (`accounts`, `people`, `transactions`) has its own
  `index.js` (list + create) and `[id].js` (update/delete) pair.
- Push to GitHub — Vercel redeploys automatically on every push if you
  used the dashboard import method.

## Notes

- Free-tier Vercel Postgres has storage/row limits fine for personal use;
  check the Storage tab if you ever need to see usage.
- If you'd rather keep everything free forever with no time-boxed trial
  database, Neon, Supabase, or Railway all offer a free Postgres tier you
  can point `POSTGRES_URL` at instead — same code, just a different
  connection string in Vercel's env vars.
- Budgets, recurring payments, and a calendar view still aren't built —
  same as the local version.
