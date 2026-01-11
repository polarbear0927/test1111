const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/security');
const db = require('../config/db');

router.get('/dashboard', verifyToken, requireAdmin, (req, res) => {
  res.json({
    message: '管理員驗證成功',
    admin: req.user.email
  });
});

router.get('/users', verifyToken, requireAdmin, (req, res) => {
  db.all(
    "SELECT email, role FROM users",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
});

module.exports = router;
