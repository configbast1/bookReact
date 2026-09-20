# Deployment

## GitHub

```bash
git add .
git commit -m "Bookstore: React 19, i18n, Headless UI, TanStack Query, tests"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

`.env` is git-ignored, so real keys never reach the repository — only the `.env.example`
template is committed.

## Vercel

1. Vercel → **Add New… → Project** → pick the repository.
2. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
3. Settings → **Environment Variables** — copy the variables from `.env.example` and set
   your own values.
4. **Deploy**.

After deployment two URLs are live:

- the site — `https://<project>.vercel.app`
- the endpoint — `https://<project>.vercel.app/api/about_me`

Vercel turns the `api/` folder into a serverless function automatically, no extra setup is
needed. The rule in `vercel.json` sends every other path to `index.html`, so direct links
such as `/catalog` and `/book/b01` work.

## Checking the production build locally

```bash
npm run build
npm run preview
```

The build is served at `http://localhost:4173`, and the `about_me` endpoint works there too.
