# Bookstore — an online book shop built with React

A final study project: book catalog, cart, checkout, user account, admin panel,
a favorite books section and an "About me" page that reads data from its own
server endpoint.

Русская версия: [README.md](README.md)

## Stack

| Layer | Technologies |
| --- | --- |
| Build | Vite 5, React 19 |
| State | Redux Toolkit, Context API, TanStack Query |
| Routing | React Router 6 (nested routes, 404) |
| Forms | React Hook Form + Zod, Formik + Yup, `useActionState` |
| UI | CSS Modules, Headless UI (Dialog, Menu), two themes |
| Languages | i18next + react-i18next (Russian and English) |
| Data | json-server, repositories with a localStorage fallback |
| Tests | Vitest, Testing Library |

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

`npm start` runs the front end at `http://localhost:5173` and json-server at `http://localhost:3001`.

Individual commands:

```bash
npm run dev            # front end only
npm run server         # API only (json-server + db.json)
npm run build          # production build into dist/
npm run preview        # preview the build
npm run lint           # ESLint
npm test               # run the tests
npm run test:coverage  # tests with a coverage report
```

The app also works without json-server: repositories fall back to a local copy of the
data in localStorage (`src/core/api/BaseRepository.js`).

## Environment variables

All keys and URLs live in `.env` (git-ignored, template in `.env.example`) and are read
through `src/config/env.js` only.

| Variable | Purpose |
| --- | --- |
| `VITE_APP_NAME` | Shop name in the header and footer |
| `VITE_API_URL` | API base URL |
| `VITE_API_TIMEOUT` | Request timeout, ms |
| `VITE_ABOUT_ME_URL` | URL of the "About me" endpoint |
| `VITE_DEFAULT_LOCALE` | Default language (`ru` or `en`) |
| `VITE_FREE_SHIPPING_FROM` | Free shipping threshold |
| `VITE_CURRENCY` | Currency (`UAH`, `USD`, `EUR`, `PLN`) |
| `VITE_SUPPORT_EMAIL` | Contact address in the footer |
| `VITE_ANALYTICS_KEY` | Example of a secret that must never be hard-coded |

On Vercel the same variables are set in Settings → Environment Variables.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@book.ua` | `admin123` |
| Customer | `user@book.ua` | `user123` |

Promo codes: `BOOK10` (−10%), `READMORE` (−15%), `STUDENT` (−20%).

## Routes

| Path | Page |
| --- | --- |
| `/` | Storefront with curated shelves |
| `/catalog` | Catalog: categories, filters, sorting, pagination |
| `/book/:id` | Book page, reviews, preview dialog |
| `/products/:id` | Redirect to the book page |
| `/cart`, `/checkout` | Cart and checkout |
| `/favorites` | Favorite books with reviews |
| `/about-me` | Data from the `/api/about_me` endpoint |
| `/login` | Sign in and sign up |
| `/account/profile`, `/account/orders`, `/account/settings` | User account (nested routes) |
| `/admin`, `/admin/books`, `/admin/orders`, `/admin/quick-add`, `/admin/formik` | Admin panel (nested routes) |
| anything else | 404 page |

## The "About me" endpoint

`api/about_me.js` is a Vercel serverless function that returns JSON facts about the author.
In development the same file is served by a small Vite plugin, so
`http://localhost:5173/api/about_me` works without a separate server.

## Documentation

- [Architecture](docs/ARCHITECTURE.en.md)
- [Testing](docs/TESTING.en.md)
- [Deployment](docs/DEPLOY.en.md)
- [Assignment checklist](docs/HOMEWORK.en.md)
