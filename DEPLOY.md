# Как переподключить Vercel к GitHub и обновить сайт

Если в Vercel показывается «Reconnect to GitHub» и сайт не обновляется после пуша:

## 1. Переподключить репозиторий

1. Зайди в [Vercel Dashboard](https://vercel.com/dashboard).
2. Открой проект **chip-workshop** (или как он у тебя назван).
3. **Settings** → вкладка **Git**.
4. Если видишь **Connect Git Repository** или **Reconnect**:
   - Нажми и выбери **GitHub**.
   - Разреши доступ к аккаунту GitHub и репозиторию **antonbudetbezb/Chip-workshop**.
   - Выбери репозиторий `Chip-workshop`, ветку **main** как Production Branch.
5. Сохрани.

## 2. Проверить Production Branch

В **Settings** → **Git** убедись, что:
- **Production Branch** = `main`.
- При пуше в `main` должны автоматически запускаться деплои.

## 3. Запустить деплой вручную (если нужно)

- Вкладка **Deployments** → кнопка **Redeploy** у последнего деплоя, или **Create Deployment** и выбери ветку `main`.

## 4. Убедиться, что обновилось

- Открой https://chip-workshop.vercel.app
- **Правый клик → Просмотреть код страницы** (View Page Source). В начале HTML должна быть строка:
  `<!-- chip-workshop deploy from GitHub main -->`
  Если она есть — отдаётся новая версия с GitHub.

Если проект изначально был создан через **Import** из папки (без Git), его нужно один раз связать с GitHub по шагам выше; после этого каждый пуш в `main` будет обновлять сайт.
