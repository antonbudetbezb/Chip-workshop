# Chip-workshop

Публичная визитка / портфолио: одностраничный сайт с анимацией частиц и тёмной темой в стиле BMW Isle of Man Green.

## Что внутри

- **index.html** — вся вёрстка, стили и скрипт частиц в одном файле
- **avatar.jpg** — фото для блока Hero
- Адаптивная вёрстка, плавные анимации, интерактивные частицы (реакция на курсор и клики)

## Локальный запуск

Открой `index.html` в браузере или подними простой сервер:

```bash
# Python 3
python -m http.server 8080

# или npx
npx serve .
```

Сайт будет доступен по адресу http://localhost:8080

## Секреты и конфиг

- Файл **.env** в репозиторий не попадает (см. `.gitignore`).
- Для локальной разработки скопируй `.env.example` в `.env` и при необходимости заполни переменные (например, для будущей формы обратной связи или аналитики).

## Публикация на GitHub

1. **Настрой Git (один раз):**
   ```bash
   git config --global user.name "Твоё Имя"
   git config --global user.email "твой@email.com"
   ```

2. **Первый коммит (если ещё не сделан):**
   ```bash
   git add .
   git commit -m "Initial commit: Chip-workshop — визитка с частицами и тёмной темой"
   ```

3. **Создай репозиторий на GitHub:**
   - Зайди на [github.com/new](https://github.com/new)
   - Имя репозитория: **Chip-workshop**
   - Public, без README (он уже есть локально)

4. **Привяжи remote и запушь:**
   ```bash
   git remote add origin https://github.com/ТВОЙ_USERNAME/Chip-workshop.git
   git branch -M main
   git push -u origin main
   ```
   Подставь свой GitHub-username вместо `ТВОЙ_USERNAME`.

   Если установлен [GitHub CLI](https://cli.github.com/), можно сделать так:
   ```bash
   gh repo create Chip-workshop --public --source=. --remote=origin --push
   ```

## Автодеплой на Vercel (main → production)

Создать новый проект на Vercel и привязать его к этому репозиторию (обновление **main** = автоматический деплой):

**→ [Import Chip-workshop into Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fantonbudetbezb%2FChip-workshop)** — открой ссылку, войди через GitHub (если ещё не вошёл), нажми **Deploy**. Production branch по умолчанию — `main`.

Либо вручную:

1. Зайди на [vercel.com](https://vercel.com) и войди через **GitHub**.
2. **Add New…** → **Project** → импортируй репозиторий **antonbudetbezb/Chip-workshop**.
3. Оставь настройки по умолчанию (Root Directory: `.`, Build Command — пусто). Нажми **Deploy**.
4. В настройках проекта: **Settings** → **Git** → проверь, что **Production Branch** = `main`.

После деплоя продовый сайт будет по адресу вида **`https://chip-workshop-<твой-ник>.vercel.app`** (или свой домен в настройках проекта).

## Лицензия

MIT — см. [LICENSE](LICENSE).
