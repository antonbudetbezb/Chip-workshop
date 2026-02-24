/**
 * Local dev server: serves static site + /api/chat using .env.local (MINIMAX_API_KEY).
 * Production: Vercel serves api/chat.js and injects env vars from project Settings.
 */
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mount the same handler Vercel uses for /api/chat
const chatHandler = require('./api/chat.js');
app.all('/api/chat', (req, res) => chatHandler(req, res));

app.listen(PORT, () => {
  console.log(`Local server: http://localhost:${PORT}`);
  console.log(`Chat API: POST http://localhost:${PORT}/api/chat`);
  console.log(`MINIMAX_API_KEY: ${process.env.MINIMAX_API_KEY ? 'set' : 'not set'}`);
});
