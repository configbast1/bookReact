# Assignment checklist

| Requirement | Where it is implemented |
| --- | --- |
| Lists: a separate function component for the item and one for the list with `data.map` | `NavList/NavItem`, `CategoryList/CategoryListItem`, `BookGrid/BookCard`, `CartList/CartItemRow`, `ReviewList/ReviewItem`, `OrderList/OrderCard`, `StatList/StatCard`, `FavoriteList/FavoriteCard`, `FactList/FactItem` |
| A modal dialog from a UI library (Headless UI) used at least twice | `ui/Modal.jsx` built on `@headlessui/react`; used on the book page (preview), in the admin panel (book form and delete confirmation) and in the cart (clear confirmation) — four places. The language picker uses the same library's `Menu` |
| All keys and base URLs in `.env` with the `VITE_` prefix, read via `import.meta.env`, `.env` git-ignored | `.env`, `.env.example`, `src/config/env.js`, the `.env` line in `.gitignore` |
| A Node.js project with an endpoint returning JSON with 10+ personal facts, deployed to Vercel | `api/about_me.js` (20 fields), the `/about-me` page renders the response, instructions in `docs/DEPLOY.en.md` |
| Routing: at least three routes, nested routes, a product page and a 404 page | `src/App.jsx`: `/account` and `/admin` sections with nested routes, `/book/:id`, `/products/:id`, `*` → 404 |
| An async React form built with `useActionState` | `components/admin/AsyncBookForm.jsx`, page `/admin/quick-add` |
| Form validation with React Hook Form (plus a Formik variant) | RHF + Zod in every form; the Formik + Yup variant is `components/admin/FormikBookForm.jsx`, page `/admin/formik` |
| A favorite books app: 3+ function components, state and props, ten reviews | The `/favorites` section: `FavoriteList`, `FavoriteCard`, `ReviewList`, `ReviewItem`, `ReviewForm`; the first book has ten reviews and new ones are added to state |
| At least five tests in a dedicated file | 8 files, 25 tests — see `docs/TESTING.en.md` |
| Extra technologies of my own choice | React 19 (`useActionState`), TanStack Query, Headless UI, i18next (Russian and English UI), Zod, Vitest |
| Data persistence | localStorage (cart, filters, reviews, recently viewed) and cookies (session, theme, language) |

## Demo script

1. Catalog: categories on the left, filters, sorting, pagination.
2. Book page: preview dialog, reviews, adding a review.
3. Cart: promo code, clear confirmation dialog, checkout.
4. Account: profile with validation, orders, theme and language settings.
5. Admin: statistics, book CRUD, order status changes, two book creation forms.
6. About me page: data fetched from the endpoint with the raw response visible.
7. Switching the language RU ↔ EN in the header.
8. Terminal: `npm test` — 25 tests pass.
