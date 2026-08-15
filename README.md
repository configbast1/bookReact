# 📖 Книгарня — інтернет-магазин книг на React

Навчальний проєкт: повноцінний магазин книг з ООП-ядром, Redux Toolkit, Context API,
фільтрами, кошиком, оформленням замовлення, адмін-панеллю та адаптивною версткою.

**Стек:** Vite + React 18 (JavaScript) · Redux Toolkit · React Router 6 · CSS Modules · json-server

---

## Швидкий старт

```bash
npm install          # встановити залежності
npm start            # запустити фронтенд (5173) + json-server (3001) разом
```

Або окремо:

```bash
npm run server       # API на http://localhost:3001 (json-server + db.json)
npm run dev          # фронтенд на http://localhost:5173
npm run build        # продакшн-збірка в dist/
npm run preview      # переглянути продакшн-збірку
npm run lint         # перевірка ESLint
```

> **Без сервера теж працює.** Якщо json-server не запущений, репозиторії
> автоматично перемикаються на локальну копію даних у `localStorage`
> (див. `src/core/api/BaseRepository.js`). Тому проєкт можна задеплоїти
> як статичний сайт і він буде повністю функціональним.

## Демо-доступи

| Роль | Email | Пароль |
|------|-------|--------|
| Адміністратор | `admin@book.ua` | `admin123` |
| Покупець | `user@book.ua` | `user123` |

Промокоди: `BOOK10` (−10%), `READMORE` (−15%), `STUDENT` (−20%).

---

## Що вміє застосунок

- **Каталог** — 24 книги трьох форматів (паперові, електронні, аудіо)
- **Пошук і фільтри** — текстовий пошук з debounce, жанр, формат, ціна, рейтинг,
  наявність, новинки; 6 варіантів сортування; пагінація
- **Кошик** — додавання, зміна кількості, промокоди, розрахунок доставки,
  збереження між сесіями
- **Оформлення замовлення** — форма з повною валідацією, вибір доставки та оплати
- **Авторизація** — вхід і реєстрація, сесія в cookie, ролі (покупець / адмін)
- **Адмін-панель** — статистика, CRUD книг, керування статусами замовлень
- **Теми** — світла і темна, вибір запамʼятовується в cookie
- **Адаптивність** — від 320px до десктопу, мобільне меню, таблиці-картки

---

## Структура проєкту

```
src/
├── core/                  ← «ядро» без React: чиста бізнес-логіка
│   ├── models/            ← ООП-класи домену (Entity → Product → Book → …)
│   ├── validation/        ← ієрархія валідаторів + схеми форм
│   ├── storage/           ← адаптери сховищ (localStorage, cookie, memory)
│   └── api/               ← HttpClient + репозиторії
├── store/                 ← Redux Toolkit: слайси, селектори, middleware
├── context/               ← useContext: тема, авторизація, сповіщення
├── hooks/                 ← власні хуки: useForm, useCart, useDebounce, …
├── components/            ← UI, layout, books, cart, admin
├── pages/                 ← сторінки-маршрути
├── data/                  ← початкові дані каталогу
└── styles/                ← дизайн-токени
```

Детальний опис архітектури — у [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Виконання вимог до проєкту

| # | Вимога | Де реалізовано |
|---|--------|----------------|
| 1 | 5+ класів ООП, успадкування | `src/core/models/` — 13 класів у 3 гілках успадкування, плюс `src/core/validation/` (9 класів) і `src/core/storage/` (4 класи) |
| 2 | Пропси, хуки | PropTypes у кожному компоненті; 5 власних хуків у `src/hooks/`; `useState/useEffect/useMemo/useCallback/useRef/useId/memo` |
| 3 | Фільтри пошуку товарів | `src/components/books/BookFilters.jsx` + `src/store/filtersSlice.js` + `selectFilteredBooks` |
| 4 | Кошик та замовлення | `src/store/cartSlice.js`, `src/hooks/useCart.js`, `CartPage`, `CheckoutPage`, `OrdersPage` |
| 5 | Адмін-панель | `src/pages/AdminPage.jsx` + `src/components/admin/` (CRUD + статистика) |
| 6 | Валідація форм | `src/core/validation/` (ООП-валідатори) + `src/hooks/useForm.js` |
| 7 | Збереження даних | cookie (`CookieAdapter`: сесія, тема), localStorage (`LocalStorageAdapter`: кошик, фільтри, історія переглядів), БД (`db.json` + json-server) |
| 8 | useContext / Redux | 3 контексти у `src/context/`, 4 слайси Redux Toolkit у `src/store/` |
| 9 | Ергономіка та стилі | CSS-змінні, темна тема, скелетони, порожні стани, focus-visible, ARIA, `prefers-reduced-motion` |
| 10 | Репозиторій, архітектура | цей README + `docs/ARCHITECTURE.md` |
| 11 | Деплой та адаптивність | `vercel.json`, media queries у кожному модулі, перевірено від 320px |
| 12 | Доповідь та питання по коду | `docs/PRESENTATION.md` + `docs/QA.md` |

---

## Деплой

**Vercel / Netlify:**

```bash
npm run build       # артефакт у dist/
```

Налаштування вже є у `vercel.json` (SPA-редіректи на `index.html`).

**GitHub Pages:** додайте `base: '/назва-репозиторію/'` у `vite.config.js`
і використайте `gh-pages -d dist`.

---

## Ліцензія

Навчальний проєкт, вільне використання.
