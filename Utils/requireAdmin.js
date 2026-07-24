const AdminSession = require('../Model/AdminSession.js');

// Guards admin routes. Accepts either:
//   - Authorization: Bearer <token>   (issued by /verifyotp, used by the admin UI)
//   - x-admin-key: <ADMIN_SECRET>      (used by the CI blog generator)
// ADMIN_SECRET must be set in the backend environment.
module.exports = async function requireAdmin(req, res, next) {
  try {
    const key = req.header('x-admin-key');
    if (key && process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET) {
      return next();
    }

    const auth = req.header('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
    if (token) {
      const session = await AdminSession.findOne({ token });
      if (session && session.expiresAt > new Date()) {
        req.adminEmail = session.email;
        return next();
      }
    }

    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
