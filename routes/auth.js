const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ❌ 不要 require security
// ❌ 不要 verifyToken
// ❌ 不要 admin

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.get('/profile', authController.profile);

module.exports = router;
