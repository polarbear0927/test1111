const express = require('express');
const helmet = require('helmet');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

/**
 * Security Middleware
 * Helmet：HTTP Security Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],   // 🔐 CSP 完整版（加分）
        imgSrc: ["'self'", "data:"]
      },
    },
  })
);

/**
 * Basic Middleware
 */
app.use(express.json());
app.use(express.static('public'));

/**
 * Root Entry（首頁導向登入）
 * ✅ 一定要在 listen 之前
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

/**
 * Server Start（一定放最後）
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器啟動於 http://localhost:${PORT}`);
});
