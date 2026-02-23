# Chip-workshop

Портфолио-визитка: одностраничный сайт в стиле BMW Isle of Man Green, анимация частиц, AI-чат-бот по данным портфолио (интеграция [cursor-ai-chatbot](https://github.com/evgyur/cursor-ai-chatbot) и MiniMax API).

## Техническая информация

- **Стек:** HTML/CSS/JS (`index.html`), Vercel Serverless (`api/chat.js`) для чат-бота.
- **Файлы:** `index.html`, `avatar.jpg`, `api/chat.js`, `knowledge.json`, `vercel.json`.
- **Локальный запуск:** статика — `npx serve .` или открыть `index.html`. Для чата с AI нужен бэкенд (см. ниже).
- **Лицензия:** MIT — см. [LICENSE](LICENSE).

## Чат-бот (cursor-ai-chatbot + MiniMax)

- Виджет на странице вызывает `POST /api/chat` (Vercel serverless).
- База знаний: портфолио Антона, услуги, контакты, факт о типографике (Дитер Рамс). Данные в `knowledge.json` и в системном промпте в `api/chat.js`.
- **Чтобы чат отвечал через AI:** получи API ключ на [platform.minimax.io](https://platform.minimax.io), затем в Vercel → проект → Settings → Environment Variables добавь:
  - `MINIMAX_API_KEY` = твой ключ
- Без ключа чат всё равно открывается и показывает сообщение «Чат временно недоступен» с контактами.

## Ветки и слияние

- Чат-бот в ветке `feature/chatbot`. После проверки слить в `main`:
  - `git checkout main`
  - `git merge feature/chatbot`
  - `git push origin main`
