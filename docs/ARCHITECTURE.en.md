# Architecture

## Folder structure

```
api/                  about_me serverless function (Vercel)
src/
  components/
    about/            FactList + FactItem
    admin/            tables, book forms (RHF, useActionState, Formik), stat tiles
    books/            BookGrid + BookCard, catalog filters
    cart/             CartList + CartItemRow, cart summary
    catalog/          CategoryList + CategoryListItem (genre side menu)
    favorites/        FavoriteList + FavoriteCard
    layout/           header, footer, navigation, language switcher, route guard
    orders/           OrderList + OrderCard
    reviews/          ReviewList + ReviewItem + ReviewForm
    ui/               buttons, fields, dialogs, rating, pagination and so on
  config/env.js       the only place that reads environment variables
  context/            theme, authentication, toasts
  core/
    api/              HttpClient and repositories
    models/           OOP core: Entity → Product → Book → PaperBook/EBook/AudioBook
    storage/          localStorage, cookie and memory adapters
  data/               seed data and genre/format dictionaries
  hooks/              useCart, useReviews, useAboutMe, useDebounce and others
  i18n/               i18next setup and ru/en dictionaries
  lib/queryClient.js  TanStack Query setup
  pages/              application pages
  services/           network services (about_me, for example)
  store/              Redux slices, selectors, persistence middleware
  test/               render helper with all providers
  validation/         Zod and Yup schemas, error message translation
```

## Lists

Every list in the app is a pair of components: a list function component that calls
`data.map`, and a separate function component for a single item.

| List | Item | Used in |
| --- | --- | --- |
| `NavList` | `NavItem` | Header navigation |
| `CategoryList` | `CategoryListItem` | Genre side menu in the catalog |
| `BookGrid` | `BookCard` | Catalog, storefront, similar books |
| `CartList` | `CartItemRow` | Cart |
| `ReviewList` | `ReviewItem` | Book reviews and favorite book reviews |
| `OrderList` | `OrderCard` | Order history |
| `StatList` | `StatCard` | Admin statistics |
| `FavoriteList` | `FavoriteCard` | Favorite books section |
| `FactList` | `FactItem` | About me page |

## State

- **Redux Toolkit** — catalog, filters, cart, orders. Filters and cart are persisted to
  localStorage by the custom `persistMiddleware`.
- **Context API** — theme, authentication, toast notifications.
- **TanStack Query** — fetching the "About me" endpoint: caching, retry, loading and
  error states.
- **Local state** — forms, dialogs, expanding reviews.

## OOP core

`Entity` is an abstract base class with private fields and an id generator.
`Product` → `Book` → `PaperBook` / `EBook` / `AudioBook` inherit from it, and so do
`User` → `Customer` / `AdminUser` and `Order`.

- polymorphism: `getDiscountPercent()` and `getShippingCost()` are overridden in subclasses;
- encapsulation: price, stock, rating and password live in private fields with checks;
- factories: `BookFactory` and `UserFactory` build the right subclass from `format` or `role`;
- state machine: `Order` validates every status transition itself.

## Dialogs

All modals are built on the Headless UI `Dialog` (`src/components/ui/Modal.jsx`), with
`ConfirmDialog` on top of it. Dialogs are used in four places: the book preview, the book
form in the admin panel, the delete confirmation and the clear-cart confirmation. The
language picker uses the `Menu` component from the same library.

## Forms

| Form | Library | File |
| --- | --- | --- |
| Sign in and sign up | React Hook Form + Zod | `pages/LoginPage.jsx` |
| Checkout | React Hook Form + Zod | `pages/CheckoutPage.jsx` |
| User profile | React Hook Form + Zod | `pages/ProfilePage.jsx` |
| Book form in admin | React Hook Form + Zod | `components/admin/BookForm.jsx` |
| Quick book creation | `useActionState` + React Hook Form | `components/admin/AsyncBookForm.jsx` |
| The same form with Formik | Formik + Yup | `components/admin/FormikBookForm.jsx` |
| Review | React Hook Form + Zod | `components/reviews/ReviewForm.jsx` |

Validation messages are stored as translation keys and rendered through `translateError`
from `src/validation/messages.js`, so validation is bilingual as well.

## Languages

`src/i18n` loads the `ru.json` and `en.json` dictionaries. The chosen language is stored in
a cookie; on the first visit the browser language is used, otherwise `VITE_DEFAULT_LOCALE`.
Book titles and authors stay in their original language — only the interface is translated.
