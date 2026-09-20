# Архитектура

## Структура каталогов

```
api/                  серверная функция about_me (Vercel)
src/
  components/
    about/            FactList + FactItem
    admin/            таблицы, формы книг (RHF, useActionState, Formik), плитки статистики
    books/            BookGrid + BookCard, фильтры каталога
    cart/             CartList + CartItemRow, итоги корзины
    catalog/          CategoryList + CategoryListItem (боковое меню жанров)
    favorites/        FavoriteList + FavoriteCard
    layout/           шапка, подвал, навигация, переключатель языка, защита маршрутов
    orders/           OrderList + OrderCard
    reviews/          ReviewList + ReviewItem + ReviewForm
    ui/               кнопки, поля, диалоги, рейтинг, пагинация и т.д.
  config/env.js       единственная точка доступа к переменным окружения
  context/            темы, авторизация, всплывающие уведомления
  core/
    api/              HttpClient и репозитории (Repository)
    models/           ООП-ядро: Entity → Product → Book → PaperBook/EBook/AudioBook
    storage/          адаптеры localStorage, cookie и памяти
  data/               стартовые данные и словари жанров/форматов
  hooks/              useCart, useReviews, useAboutMe, useDebounce и др.
  i18n/               настройка i18next и словари ru/en
  lib/queryClient.js  настройка TanStack Query
  pages/              страницы приложения
  services/           сетевые сервисы (например, about_me)
  store/              срезы Redux, селекторы, middleware сохранения
  test/               обёртка рендера с провайдерами для тестов
  validation/         схемы Zod и Yup, перевод сообщений об ошибках
```

## Списки

Каждый список в приложении — это пара компонентов: функциональный компонент списка,
внутри которого вызывается `data.map`, и отдельный функциональный компонент пункта.

| Список | Пункт | Где используется |
| --- | --- | --- |
| `NavList` | `NavItem` | Навигация в шапке |
| `CategoryList` | `CategoryListItem` | Боковое меню жанров в каталоге |
| `BookGrid` | `BookCard` | Каталог, витрина, похожие книги |
| `CartList` | `CartItemRow` | Корзина |
| `ReviewList` | `ReviewItem` | Отзывы о книге и о любимых книгах |
| `OrderList` | `OrderCard` | История заказов |
| `StatList` | `StatCard` | Статистика в админке |
| `FavoriteList` | `FavoriteCard` | Раздел «Любимые книги» |
| `FactList` | `FactItem` | Страница «Обо мне» |

## Состояние

- **Redux Toolkit** — каталог, фильтры, корзина, заказы. Срез фильтров и корзина
  сохраняются в localStorage через собственный middleware `persistMiddleware`.
- **Context API** — тема оформления, авторизация, всплывающие уведомления.
- **TanStack Query** — загрузка данных эндпоинта «Обо мне»: кэш, повтор запроса,
  состояния загрузки и ошибки.
- **Локальное состояние** — формы, диалоги, раскрытие отзывов.

## ООП-ядро

`Entity` — абстрактный базовый класс с приватными полями и генератором идентификаторов.
От него наследуются `Product` → `Book` → `PaperBook` / `EBook` / `AudioBook`,
а также `User` → `Customer` / `AdminUser` и `Order`.

- полиморфизм: `getDiscountPercent()` и `getShippingCost()` переопределяются в наследниках;
- инкапсуляция: цена, остаток, рейтинг и пароль хранятся в приватных полях с проверками;
- фабрики: `BookFactory` и `UserFactory` создают нужный подкласс по полю `format` или `role`;
- машина состояний: `Order` сам проверяет допустимость смены статуса.

## Диалоги

Все модальные окна построены на `Dialog` из Headless UI (`src/components/ui/Modal.jsx`),
поверх него сделан `ConfirmDialog`. Диалоги используются в четырёх местах:
отрывок книги, форма книги в админке, подтверждение удаления книги и подтверждение
очистки корзины. Меню выбора языка — компонент `Menu` из той же библиотеки.

## Формы

| Форма | Библиотека | Файл |
| --- | --- | --- |
| Вход и регистрация | React Hook Form + Zod | `pages/LoginPage.jsx` |
| Оформление заказа | React Hook Form + Zod | `pages/CheckoutPage.jsx` |
| Профиль пользователя | React Hook Form + Zod | `pages/ProfilePage.jsx` |
| Книга в админке | React Hook Form + Zod | `components/admin/BookForm.jsx` |
| Быстрое добавление книги | `useActionState` + React Hook Form | `components/admin/AsyncBookForm.jsx` |
| Та же форма на Formik | Formik + Yup | `components/admin/FormikBookForm.jsx` |
| Отзыв | React Hook Form + Zod | `components/reviews/ReviewForm.jsx` |

Сообщения об ошибках хранятся как ключи перевода и переводятся функцией
`translateError` из `src/validation/messages.js`, поэтому валидация тоже двуязычная.

## Языки

`src/i18n` подключает словари `ru.json` и `en.json`. Выбранный язык сохраняется в cookie,
при первом заходе берётся язык браузера, иначе значение `VITE_DEFAULT_LOCALE`.
Названия и авторы книг остаются на языке оригинала — переводится только интерфейс.
