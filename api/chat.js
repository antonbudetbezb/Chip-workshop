/**
 * AI Chat API — MiniMax (cursor-ai-chatbot from evgyur/cursor-ai-chatbot)
 * Vercel Serverless Function
 *
 * Env: MINIMAX_API_KEY (get at https://platform.minimax.io)
 */

const KNOWLEDGE_TEXT = `Кто такой Антон: Антон — фронтенд-разработчик и дизайнер интерфейсов. Делает удобные и быстрые веб-интерфейсы. Интересуется типографикой, анимациями и минималистичным дизайном.

Услуги: вёрстка, интерактивные веб-приложения, фокус на UX и чистом коде. От доведения идеи до работающего продукта. Открыт к совместным проектам.

Контакты: Email your@email.com. Telegram, GitHub, LinkedIn — ссылки в разделе «Контакты» внизу страницы.

О себе: работа в веб-разработке от вёрстки до интерактивных приложений. В свободное время пробую новые технологии, читаю про продукт и дизайн-системы. Открыт к совместным проектам.

Типографика и минимализм: Дитер Рамс: «Хороший дизайн — это как можно меньше дизайна». В минимализме типографика и пустое пространство несут основную смысловую нагрузку.

Портфолио: одностраничный сайт в тёмной теме в стиле BMW Isle of Man Green, с анимацией частиц.`;

const SYSTEM_PROMPT = `Ты консультант на сайте-портфолио Антона (фронтенд, дизайн интерфейсов).

ПРАВИЛА:
1. Отвечай ТОЛЬКО на основе информации ниже.
2. Не выдумывай факты. Если информации нет — скажи кратко, что не знаешь, и предложи спросить об услугах или контактах.
3. Отвечай кратко и по-русски.

Данные:
${KNOWLEDGE_TEXT}`;

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
          { role: 'system', content: SYSTEM_PROMPT },
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

    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Chat API error:', err.message);
    return res.status(200).json({
      response: 'Произошла ошибка. Напишите на your@email.com или используйте контакты ниже.',
    });
  }
};
