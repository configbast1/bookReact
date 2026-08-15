# Архітектура проєкту

## Загальна ідея

Застосунок розділений на **чотири шари**. Кожен шар знає лише про той, що нижче.

```
┌──────────────────────────────────────────────┐
│  pages/          сторінки-маршрути           │
│  components/     UI-компоненти               │  ← React, JSX, CSS Modules
├──────────────────────────────────────────────┤
│  hooks/          власні хуки                 │
│  context/        useContext (тема, auth)     │  ← «клей» між UI та станом
│  store/          Redux Toolkit               │
├──────────────────────────────────────────────┤
│  core/api/       репозиторії, HttpClient     │  ← доступ до даних
├──────────────────────────────────────────────┤
│  core/models/    ООП-моделі домену           │
│  core/validation/ правила валідації          │  ← чистий JS, без React
│  core/storage/   адаптери сховищ             │
└──────────────────────────────────────────────┘
```

**Головне правило:** у папці `core/` немає жодного імпорту React. Це звичайний
JavaScript, який можна перенести в інший проєкт (Vue, Node.js, тести) без змін.

---

## 1. Доменні моделі (`src/core/models/`)

### Три гілки успадкування від спільного предка

```
Entity (абстрактний)
├── Product (абстрактний)
│   └── Book
│       ├── PaperBook     формат 'paper'  — обкладинка, вага, платна доставка
│       ├── EBook         формат 'ebook'  — файл, знижка 15%, доставка 0
│       └── AudioBook     формат 'audio'  — диктор, тривалість, знижка 10%
├── User (абстрактний)
│   ├── Customer          роль 'customer' — бонуси, адреса
│   └── AdminUser         роль 'admin'    — доступ до адмінки
└── Order                 машина станів замовлення

CartItem                  value-object (композиція: книга + кількість)
BookFactory / UserFactory  фабрики: JSON → потрібний клас
```

### Які принципи ООП тут задіяні

| Принцип | Приклад у коді |
|---------|----------------|
| **Інкапсуляція** | Приватні поля `#id`, `#price`, `#passwordHash`. Ціну можна змінити тільки через сеттер, який не пропустить відʼємне число |
| **Успадкування** | `PaperBook → Book → Product → Entity` — чотири рівні |
| **Поліморфізм** | `getDiscountPercent()`: 0 у `Product`, 15 у `EBook`, 10 у `AudioBook`. Кошик викликає метод, не знаючи типу товару |
| **Абстракція** | `new.target === Entity` кидає помилку — абстрактний клас не можна створити |
| **Композиція** | `CartItem` містить `Book`, `Order` містить масив позицій |
| **Фабрика** | `BookFactory.create({format:'ebook'})` повертає `EBook` |

### Приклад поліморфізму

```js
// selectors.js — код не знає, яка саме книга перед ним
const shipping = items.reduce(
  (max, item) => Math.max(max, item.book.getShippingCost()),
  0
);
// PaperBook поверне 60 або 80, EBook і AudioBook — 0
```

### Бізнес-правила живуть у моделі, а не в компоненті

```js
// Order.js — машина станів
static TRANSITIONS = {
  new:        ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['done'],
  done:       [],
  cancelled:  [],
};

order.setStatus('done'); // кине помилку, якщо поточний статус 'new'
```

Адмін-панель просто показує `Order.TRANSITIONS[статус]` — вона не дублює правила.

---

## 2. Валідація (`src/core/validation/`)

```
Validator (абстрактний, метод validate() = шаблонний метод)
├── RequiredValidator
├── MinLengthValidator
├── MaxLengthValidator
├── PatternValidator
│   ├── EmailValidator      ← четвертий рівень успадкування
│   └── PhoneValidator      ← перевизначає check(), чистить пробіли, потім super.check()
├── NumberRangeValidator
├── MatchValidator
└── PasswordValidator

ValidationSchema — композиція: { поле: [правило, правило, …] }
```

Форма не знає про конкретні правила — вона викликає `schema.validate(values)`
і отримує обʼєкт `{ email: 'Введіть коректний email' }`.

Схеми для конкретних форм зібрані у `schemas.js`:
`checkoutSchema`, `loginSchema`, `registerSchema`, `bookSchema`.

---

## 3. Сховища (`src/core/storage/`)

```
StorageAdapter (абстрактний: get / set / remove)
├── LocalStorageAdapter    кошик, фільтри, історія переглядів
├── CookieAdapter          сесія користувача, обрана тема
└── MemoryStorageAdapter   запасний варіант (режим інкогніто)
```

Це **принцип підстановки Лісков**: якщо `localStorage` недоступний,
`index.js` підставляє `MemoryStorageAdapter`, і решта коду цього не помічає:

```js
export const localStore = LocalStorageAdapter.isAvailable()
  ? new LocalStorageAdapter('bookstore')
  : new MemoryStorageAdapter('bookstore');
```

---

## 4. Доступ до даних (`src/core/api/`)

```
HttpClient          обгортка над fetch: базовий URL, таймаут, обробка помилок
BaseRepository      абстрактний CRUD-репозиторій
├── BookRepository  + getAllAsModels(), getFacet()
├── OrderRepository + changeStatus() з перевіркою переходу
└── UserRepository  + findByEmail()
```

**Ключова особливість:** репозиторій спершу пробує REST API (json-server).
Якщо мережа недоступна — назавжди перемикається на `localStorage` і працює далі:

```js
async getAll() {
  if (this.useApi) {
    try { return await this.http.get(`/${this.resource}`); }
    catch { this.useApi = false; }   // сервер не відповідає — офлайн-режим
  }
  return this.readLocal();
}
```

Завдяки цьому демо на хостингу працює без бекенду.

---

## 5. Стан застосунку: Redux vs Context

Обидва інструменти використані **свідомо, для різних задач**.

| | Redux Toolkit | Context API |
|---|---|---|
| **Що зберігає** | каталог, фільтри, кошик, замовлення | тема, поточний користувач, сповіщення |
| **Чому саме він** | дані часто змінюються, потрібні мемоізовані селектори, async thunks, DevTools | дані змінюються рідко; Context простіший і не потребує слайсу |

### Redux: слайси

- `booksSlice` — каталог + async thunks (`fetchBooks`, `createBook`, `updateBook`, `deleteBook`)
- `filtersSlice` — усі параметри фільтрації та пагінації
- `cartSlice` — позиції кошика і промокод
- `ordersSlice` — замовлення, `placeOrder`, `changeOrderStatus`

### Redux: селектори (`store/selectors.js`)

Тут відбувається головна магія. У сторі лежать **прості обʼєкти** (вимога Redux —
стан має бути серіалізовним), а компонентам потрібні **обʼєкти класів** з методами.
Міст між ними — мемоізований селектор:

```js
export const selectBookModels = createSelector(
  [selectRawBooks],
  (raw) => BookFactory.createMany(raw)   // JSON → PaperBook / EBook / AudioBook
);
```

`createSelector` кешує результат: фабрика не запускається повторно, поки
масив книг у сторі не змінився.

Далі `selectFilteredBooks` фільтрує і сортує, а `selectPagedBooks` ріже на сторінки.

### Власний middleware

`store/persistMiddleware.js` після кожної дії `cart/*` або `filters/*`
записує відповідний шматок стану у `localStorage`. Компоненти про це не знають.

---

## 6. Власні хуки (`src/hooks/`)

| Хук | Призначення |
|-----|-------------|
| `useDebounce` | відкладає значення на 300 мс — пошук не перефільтровує каталог на кожну літеру |
| `useForm` | стан форми + інтеграція з `ValidationSchema`: `values`, `errors`, `touched`, `fieldProps(name)` |
| `useCart` | фасад над Redux: `add`, `remove`, `setQty`, `applyPromoCode`, `totals` |
| `usePersistentState` | `useState`, який сам зберігається в `localStorage` |
| `useMediaQuery` | підписка на CSS media query з JS (мобільні фільтри) |

`useForm` — найцікавіший: він **не містить жодного правила валідації**.
Правила приходять ззовні як обʼєкт `ValidationSchema`. Тому одна й та сама
форма-логіка обслуговує і checkout, і логін, і форму книги в адмінці.

---

## 7. Потік даних: приклад «додати книгу в кошик»

```
Клік на кнопці в BookCard
   ↓
useCart().add(book)              ← хук-фасад
   ↓
dispatch(addToCart({ bookId }))  ← Redux action
   ↓
cartSlice reducer                ← оновлює state.cart.items
   ↓
persistMiddleware                ← пише items у localStorage
   ↓
selectCartModels                 ← items + каталог → масив CartItem
   ↓
selectCartTotals                 ← CartItem.subtotal, доставка, знижки
   ↓
Header (лічильник) та CartPage перемальовуються
```

---

## 8. Ергономіка та доступність

- **Дизайн-токени** — усі кольори у CSS-змінних, темна тема = перевизначення
  тих самих змінних під `[data-theme='dark']`
- **Скелетони** замість спінера під час завантаження каталогу
- **Порожні стани** (`EmptyState`) з поясненням і кнопкою дії
- **Валідація** показує помилку лише після `blur`, а не під час набору
- **`:focus-visible`** — помітний фокус для навігації з клавіатури
- **ARIA** — `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-live` для тостів
- **Модалка** — закриття по Esc, повернення фокусу, блокування прокрутки
- **`prefers-reduced-motion`** — анімації вимикаються для тих, кому вони заважають
- **Адаптивність** — таблиці адмінки на мобільному перетворюються на картки
  через `data-label` і `::before`

---

## 9. Чому саме така структура

1. **`core/` без React** — бізнес-логіку можна тестувати без рендеру компонентів
   і перенести в інший проєкт.
2. **Репозиторії** — компоненти не знають, звідки дані: з API чи з localStorage.
   Замінити json-server на реальний бекенд = змінити один рядок у `HttpClient`.
3. **Селектори** — уся важка робота (фільтрація, сортування) в одному місці
   і з кешуванням, а не розмазана по компонентах.
4. **Хуки-фасади** — компонент викликає `add(book)`, а не `dispatch(addToCart({...}))`.
   Якщо завтра замінити Redux на Zustand, зміниться лише `useCart.js`.
