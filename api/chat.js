/**
 * AI Chat API — MiniMax (cursor-ai-chatbot from evgyur/cursor-ai-chatbot)
 * Vercel Serverless Function
 *
 * Env: MINIMAX_API_KEY (get at https://platform.minimax.io)
 * Prices: data/prices.json (замени своими ценами).
 */

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_BASE = `Кто такой Антон: Антон — фронтенд-разработчик и дизайнер интерфейсов. Делает удобные и быстрые веб-интерфейсы. Интересуется типографикой, анимациями и минималистичным дизайном.

Услуги: вёрстка, интерактивные веб-приложения, фокус на UX и чистом коде. От доведения идеи до работающего продукта. Открыт к совместным проектам.

Контакты: Email your@email.com. Telegram, GitHub, LinkedIn — ссылки в разделе «Контакты» внизу страницы.

О себе: работа в веб-разработке от вёрстки до интерактивных приложений. В свободное время пробую новые технологии, читаю про продукт и дизайн-системы. Открыт к совместным проектам.

Типографика и минимализм: Дитер Рамс: «Хороший дизайн — это как можно меньше дизайна». В минимализме типографика и пустое пространство несут основную смысловую нагрузку.

Портфолио: одностраничный сайт в тёмной теме в стиле BMW Isle of Man Green, с анимацией частиц.`;

const DEFAULT_PRICES = `
Прайс (обязательно используй при вопросах о ценах/заказе/стоимости):
- Разработка/дизайн по часам: от 3 500 ₽/час, от 2 до 8 часов точечно — вёрстка, доработки, консультации
- Лендинг: от 25 000 ₽, обычно 5–10 рабочих дней — одностраничник под ключ, адаптив, форма
- Лендинг премиум: 50 000 – 120 000 ₽, примерно 10–20 рабочих дней — уникальный дизайн, анимации, интеграции
- Многостраничный сайт: от 60 000 ₽, от 15 до 30 рабочих дней — до 5–7 страниц, типовая вёрстка
- Веб-приложение (интерактив): от 80 000 ₽, обычно 20–45 рабочих дней — SPA, формы, личный кабинет, API
- Дизайн-система / UI-кит: от 40 000 ₽, обычно 10–25 рабочих дней — компоненты, стили, документация
`;

function loadPricesText() {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'prices.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.services || !Array.isArray(data.services)) return DEFAULT_PRICES;
    const lines = data.services.map(s => {
      const parts = [];
      parts.push(`${s.name}: ${s.price}`);
      if (s.days) parts.push(s.days);
      if (s.description) parts.push(s.description);
      return '- ' + parts.join(' — ');
    });
    return '\nПрайс (обязательно используй при вопросах о ценах/заказе/стоимости):\n' + lines.join('\n');
  } catch (_) {
    return DEFAULT_PRICES;
  }
}

/** Убирает блоки <think>...</think> из ответа модели — в чат показываем только ответ. */
function stripThinkTags(text) {
  if (typeof text !== 'string') return text;
  // убираем блок <think>...</think> (любой регистр, с пробелами)
  let out = text.replace(/\s*<think>[\s\S]*?<\/think>\s*/gi, '').trim();
  // если осталось что-то вроде "</think> ответ" — берём только текст после последнего </think>
  const lastClose = out.lastIndexOf('</think>');
  if (lastClose !== -1) out = out.slice(lastClose + 7).trim();
  return out.replace(/\n{2,}/g, '\n').trim() || text;
}

function getSystemPrompt() {
  const pricesText = loadPricesText();
  const knowledge = KNOWLEDGE_BASE + pricesText;
  return `Ты консультант на сайте-портфолио Антона (фронтенд, дизайн интерфейсов).

ПРАВИЛА:
1. Отвечай ТОЛЬКО на основе информации ниже.
2. Не выдумывай факты. Если информации нет — скажи кратко, что не знаешь, и предложи спросить об услугах или контактах.
3. Отвечай кратко и по-русски.
4. На вопросы про заказ, цены, стоимость, лендинг, услуги — ОБЯЗАТЕЛЬНО отвечай по разделу «Прайс» ниже. Не пиши, что информации о ценах нет — цены есть в Прайсе.

Данные:
${knowledge}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      response: 'Чат временно недоступен. Напишите на your@email.com или используйте контакты внизу страницы.',
    });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Нет сообщения' });
  }

  try {
    const response = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: message.trim() },
        ],
        temperature: 0.6,
        max_tokens: 1024,
        stream: false,
      }),
    });

    const data = await response.json();
    const text = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || (data && data.reply);

    if (!text) {
      return res.status(200).json({
        response: 'Не удалось получить ответ. Попробуйте переформулировать или напишите на your@email.com.',
      });
    }

    const answerOnly = stripThinkTags(text);
    return res.status(200).json({ response: answerOnly || text });
  } catch (err) {
    console.error('Chat API error:', err.message);
    return res.status(200).json({
      response: 'Произошла ошибка. Напишите на your@email.com или используйте контакты ниже.',
    });
  }
};
