const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';

  if (!validator.isEmail(email) || password.length < 8) {
    return res.status(400).json({ message: "Email 或密碼格式錯誤" });
  }

  db.get(
    "SELECT id FROM users WHERE email = ?",
    [email],
    async (err, exist) => {
      if (err) return res.status(500).json({ message: "資料庫錯誤" });
      if (exist) return res.status(409).json({ message: "Email 已被註冊" });

      const hash = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (email, password, role) VALUES (?, ?, 'user')",
        [email, hash],
        () => res.json({ message: "註冊成功，請登入" })
      );
    }
  );
};

/* =========================
   LOGIN（不發 token）
========================= */
exports.login = (req, res) => {
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';

  if (!validator.isEmail(email) || !password) {
    return res.status(400).json({ message: "請輸入正確 Email 與密碼" });
  }

  db.get(
    "SELECT id, email, password FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ message: "資料庫錯誤" });
      if (!user) return res.status(401).json({ message: "帳號或密碼錯誤" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "帳號或密碼錯誤" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expire = Date.now() + 5 * 60 * 1000;

      db.run(
        "UPDATE users SET otp = ?, otp_expire = ? WHERE id = ?",
        [otp, expire, user.id],
        () => {
          console.log("🔐 OTP =", otp);
          res.json({
            message: "帳密正確，請進行 OTP 驗證",
            userId: user.id
          });
        }
      );
    }
  );
};

/* =========================
   VERIFY OTP（發 JWT）
========================= */
exports.verifyOtp = (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP 格式錯誤" });
  }

  const now = Date.now();

  db.get(
    "SELECT id, email, role, otp, otp_expire FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "資料庫錯誤" });
      }

      if (!user || !user.otp) {
        return res.status(401).json({ message: "OTP 無效或已使用" });
      }

      if (user.otp_expire < now) {
        return res.status(401).json({ message: "OTP 已過期" });
      }

      if (user.otp !== otp) {
        return res.status(401).json({ message: "OTP 錯誤" });
      }

      // 清除 OTP（一次性）
      db.run(
        "UPDATE users SET otp = NULL, otp_expire = NULL WHERE id = ?",
        [user.id],
        () => {
          // ✅ JWT 一定要帶 role
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.json({ message: "OTP 驗證成功", token });
        }
      );
    }
  );
};


/* =========================
   PROFILE
========================= */
exports.profile = (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role   // ✅ 關鍵
      }
    });
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return res.status(401).json({ message: 'Token invalid' });
  }
};

