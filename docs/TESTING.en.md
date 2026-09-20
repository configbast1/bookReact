# Testing

Tests are written with Vitest and Testing Library on top of jsdom.

```bash
npm test               # single run
npm run test:watch     # watch mode
npm run test:coverage  # coverage report in coverage/
```

The shared helper `src/test/renderWithProviders.jsx` wraps a component in every provider:
Redux, TanStack Query, i18next, theme, toasts and the router.

## What is covered

| File | Checks |
| --- | --- |
| `src/components/ui/Button.test.jsx` | label rendering, `onClick`, disabled while loading |
| `src/components/books/BookCard.test.jsx` | title, author and price; adding to the cart; translated format badge |
| `src/components/reviews/ReviewList.test.jsx` | number of list items, text in the active language, empty state |
| `src/core/models/Order.test.js` | totals, allowed and forbidden status transitions, display name |
| `src/store/selectors.test.js` | search, format filter, price sorting, books per genre, cart totals |
| `src/services/aboutMeService.test.js` | successful API request and a 500 error |
| `src/i18n/i18n.test.jsx` | Russian and English texts, switching the language in settings |
| `src/hooks/useDebounce.test.jsx` | initial value and update after the delay |

8 files and 25 tests in total: component rendering, texts and translations, state changes,
model business logic and API response handling.

## Screenshot for the report

Run `npm test` and capture the summary line
`Test Files 8 passed (8)` / `Tests 25 passed (25)`.
