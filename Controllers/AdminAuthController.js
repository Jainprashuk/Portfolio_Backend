const crypto = require('crypto');
const AdminSession = require('../Model/AdminSession.js');

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const ADMIN_EMAIL = (process.env.ADMIN_EMAILS || '29jainprashuk@gmail.com').split(',')[0].trim();

// Constant-time compare so the check doesn't leak the password via timing.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// POST /admin/login  { password }  -> { token, expiresAt }
// Verifies against the ADMIN_PASSWORD env var (server-side only) and issues a
// short-lived session token used to authorize the admin API.
exports.login = async (req, res) => {
  try {
    const configured = process.env.ADMIN_PASSWORD;
    if (!configured) {
      return res.status(500).json({ error: 'Admin password is not configured on the server.' });
    }

    const password = req.body && req.body.password ? String(req.body.password) : '';
    if (!password || !safeEqual(password, configured)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await AdminSession.create({ token, email: ADMIN_EMAIL, expiresAt });

    res.status(200).json({ token, expiresAt });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /admin/logout  (Authorization: Bearer <token>)
exports.logout = async (req, res) => {
  try {
    const auth = req.header('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
    if (token) await AdminSession.deleteOne({ token });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
