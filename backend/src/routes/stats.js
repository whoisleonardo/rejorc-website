const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const subscribers = db.prepare('SELECT COUNT(*) as c FROM newsletter_subscribers').get().c;
  const messages = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c;
  const unreadMessages = db.prepare('SELECT COUNT(*) as c FROM contact_messages WHERE lida = 0').get().c;
  const users = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const recentSubscribers = db
    .prepare("SELECT COUNT(*) as c FROM newsletter_subscribers WHERE created_at >= datetime('now', '-30 days')")
    .get().c;

  res.json({ subscribers, recentSubscribers, messages, unreadMessages, users });
});

module.exports = router;
