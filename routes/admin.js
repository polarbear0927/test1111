const express = require('express');
const router = express.Router();

const { verifyToken, adminOnly } = require('../middleware/security');
const db = require('../config/db');

/**
 * Admin Dashboard（用來判斷是不是 admin）
 */
router.get('/dashboard', verifyToken, adminOnly, (req, res) => {
  res.json({
    message: 'admin ok',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * 使用者列表（RBAC 示範）
 */
router.get('/users', verifyToken, adminOnly, (req, res) => {
  db.all(
    'SELECT email, role FROM users',
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json(rows);
    }
  );
});

/**
 * ⚠️ 一定要放在最後
 */
module.exports = router;
