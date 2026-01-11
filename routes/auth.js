const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/security');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// ✅ profile 需要登入 token
router.get('/profile', verifyToken, authController.profile);

module.exports = router;
