# Bookstore — интернет-магазин книг на React

Учебный финальный проект: каталог книг, корзина, оформление заказа, личный кабинет,
админ-панель, раздел любимых книг и страница «Обо мне», которая читает данные
с собственного серверного эндпоинта.

English version: [README.en.md](README.en.md)

## Стек

| Слой | Технологии |
| --- | --- |
| Сборка | Vite 5, React 19 |
| Состояние | Redux Toolkit, Context API, TanStack Query |
| Маршрутизация | React Router 6 (вложенные маршруты, 404) |
| Формы | React Hook Form + Zod, Formik + Yup, `useActionState` |
| Интерфейс | CSS Modules, Headless UI (Dialog, Menu), две темы |
| Языки | i18next + react-i18next (русский и английский) |
| Данные | json-server, репозитории с резервным localStorage |
| Тесты | Vitest, Testing Library |

## Быстрый старт

```bash
npm install
cp .env.example .env
npm start
```

`npm start` поднимает фронтенд на `http://localhost:5173` и json-server на `http://localhost:3001`.

Отдельные команды:

```bash
npm run dev            # только фронтенд
npm run server         # только API (json-server + db.json)
npm run build          # продакшн-сборка в dist/
npm run preview        # просмотр сборки
npm run lint           # ESLint
npm test               # прогон тестов
npm run test:coverage  # тесты с отчётом покрытия
```

Без json-server приложение тоже работает: репозитории переключаются на локальную копию
данных в localStorage (`src/core/api/BaseRepository.js`).

## Переменные окружения

Все ключи и адреса вынесены в `.env` (файл в `.gitignore`, шаблон — `.env.example`).
В коде они доступны только через `src/config/env.js`.

| Переменная | Назначение |
| --- | --- |
| `VITE_APP_NAME` | Название магазина в шапке и подвале |
| `VITE_API_URL` | Базовый адрес API |
| `VITE_API_TIMEOUT` | Таймаут запросов, мс |
| `VITE_ABOUT_ME_URL` | Адрес эндпоинта «Обо мне» |
| `VITE_DEFAULT_LOCALE` | Язык по умолчанию (`ru` или `en`) |
| `VITE_FREE_SHIPPING_FROM` | Сумма бесплатной доставки |
| `VITE_CURRENCY` | Валюта (`UAH`, `USD`, `EUR`, `PLN`) |
| `VITE_SUPPORT_EMAIL` | Контактный адрес в подвале |
| `VITE_ANALYTICS_KEY` | Пример секретного ключа, который не должен попадать в код |

На Vercel те же переменные задаются в настройках проекта (Settings → Environment Variables).

## Демо-доступы

| Роль | Email | Пароль |
| --- | --- | --- |
| Администратор | `admin@book.ua` | `admin123` |
| Покупатель | `user@book.ua` | `user123` |

Промокоды: `BOOK10` (−10%), `READMORE` (−15%), `STUDENT` (−20%).

## Маршруты

| Путь | Страница |
| --- | --- |
| `/` | Витрина: подборки книг |
| `/catalog` | Каталог: категории, фильтры, сортировка, пагинация |
| `/book/:id` | Карточка книги, отзывы, диалог с отрывком |
| `/products/:id` | Редирект на карточку книги |
| `/cart`, `/checkout` | Корзина и оформление заказа |
| `/favorites` | Любимые книги с отзывами |
| `/about-me` | Данные с эндпоинта `/api/about_me` |
| `/login` | Вход и регистрация |
| `/account/profile`, `/account/orders`, `/account/settings` | Личный кабинет (вложенные маршруты) |
| `/admin`, `/admin/books`, `/admin/orders`, `/admin/quick-add`, `/admin/formik` | Админ-панель (вложенные маршруты) |
| любой другой | Страница 404 |

## Эндпоинт «Обо мне»

`api/about_me.js` — серверная функция для Vercel, отдающая JSON с фактами об авторе.
В режиме разработки тот же файл отдаётся плагином Vite, поэтому адрес
`http://localhost:5173/api/about_me` работает без отдельного сервера.

## Документация

- [Архитектура](docs/ARCHITECTURE.ru.md)
- [Тесты](docs/TESTING.ru.md)
- [Деплой](docs/DEPLOY.ru.md)
- [Соответствие заданиям](docs/HOMEWORK.ru.md)
