# Деплой

## GitHub

```bash
git add .
git commit -m "Bookstore: React 19, i18n, Headless UI, TanStack Query, tests"
git branch -M main
git remote add origin https://github.com/<ваш-аккаунт>/<репозиторий>.git
git push -u origin main
```

Файл `.env` в `.gitignore` — реальные ключи в репозиторий не попадают, в нём остаётся
только шаблон `.env.example`.

## Vercel

1. Vercel → **Add New… → Project** → выберите репозиторий.
2. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
3. Settings → **Environment Variables** — перенесите переменные из `.env.example`
   и задайте свои значения.
4. **Deploy**.

После деплоя работают два адреса:

- сайт — `https://<проект>.vercel.app`
- эндпоинт — `https://<проект>.vercel.app/api/about_me`

Папка `api/` разворачивается Vercel как серверная функция автоматически, отдельная
настройка не нужна. Правило в `vercel.json` отправляет все остальные пути на `index.html`,
поэтому прямые ссылки вида `/catalog` и `/book/b01` открываются корректно.

## Локальная проверка продакшн-сборки

```bash
npm run build
npm run preview
```

Сборка открывается на `http://localhost:4173`, эндпоинт `about_me` работает и там.
