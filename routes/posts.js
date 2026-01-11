const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { verifyToken, adminOnly } = require('../middleware/security');
const db = require('../config/db');

/* ======================
   multer 設定（圖片上傳）
====================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允許圖片檔案'));
    }
    cb(null, true);
  }
});

/* ======================
   取得貼文（含圖片）
====================== */
router.get('/', (req, res) => {
  db.all(
    `SELECT posts.id, posts.title, posts.content, posts.image,
            users.email AS author
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.id DESC`,
    [],
    (err, posts) => {
      if (err) return res.sendStatus(500);

      db.all(
        `SELECT comments.post_id, comments.content,
                users.email AS author
         FROM comments
         JOIN users ON comments.user_id = users.id
         ORDER BY comments.id ASC`,
        [],
        (err2, comments) => {
          if (err2) return res.sendStatus(500);

          posts.forEach(p => {
            p.comments = comments.filter(c => c.post_id === p.id);
          });

          res.json(posts);
        }
      );
    }
  );
});

/* ======================
   新增貼文（含圖片）
====================== */
router.post(
  '/',
  verifyToken,
  upload.single('image'), // ⭐ 接收 image
  (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: '標題與內容不可空白' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(
      'INSERT INTO posts (title, content, image, user_id) VALUES (?, ?, ?, ?)',
      [title, content, imagePath, userId],
      err => {
        if (err) {
          console.error('DB INSERT ERROR:', err);
          return res.status(500).json({ error: err.message });
        }
        res.sendStatus(201);
      }
    );
  }
);

/* ======================
   刪除貼文（admin）
====================== */
router.delete('/:id', verifyToken, adminOnly, (req, res) => {
  db.run(
    'DELETE FROM posts WHERE id = ?',
    [req.params.id],
    err => {
      if (err) return res.sendStatus(500);
      res.sendStatus(204);
    }
  );
});

/* ======================
   新增留言
====================== */
router.post('/:id/comments', verifyToken, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) return res.status(400).send('內容不可空白');

  db.run(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [postId, userId, content],
    err => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.sendStatus(201);
    }
  );
});

module.exports = router;
