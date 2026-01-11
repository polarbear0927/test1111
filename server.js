const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const postRoutes = require('./routes/posts'); // ✅ 提前 require

const app = express();

/**
 * Security Middleware
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:"]
      },
    },
  })
);

/**
 * Basic Middleware
 */
app.use(express.json());           // ✅ 只留一次
app.use(express.static('public'));

/**
 * Root Entry
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/**
 * API Routes（⚠️ 一定要在 listen 之前）
 */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes); // ✅ 放這裡

/**
 * Server Start（最後一行）
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器啟動於 http://localhost:${PORT}`);
});
