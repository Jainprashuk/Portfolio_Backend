const crypto = require('crypto');
const generateOtp = require('../Utils/Genreateotp.js');
const sendOtpEmail = require('../Utils/SendMail.js');
const Otp = require('../Model/Otp.js');
const AdminSession = require('../Model/AdminSession.js');

// Only these emails may log into the admin. Comma-separated env override.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '29jainprashuk@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email) =>
  typeof email === 'string' && ADMIN_EMAILS.includes(email.trim().toLowerCase());

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// POST /admin/login/request-otp  { email }
exports.requestOtp = async (req, res) => {
  try {
    const email = (req.body && req.body.email ? req.body.email : '').trim();

    // Always answer 200 so the endpoint can't be used to enumerate the admin
    // address; only actually send when it's an allowed admin email.
    if (!isAdminEmail(email)) {
      return res.status(200).json({ message: 'If that address is an admin, an OTP was sent.' });
    }

    const otp = String(generateOtp());
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'If that address is an admin, an OTP was sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// POST /admin/login/verify-otp  { email, otp }  -> { token, email, expiresAt }
exports.verifyOtp = async (req, res) => {
  try {
    const email = (req.body && req.body.email ? req.body.email : '').trim().toLowerCase();
    const otp = (req.body && req.body.otp ? String(req.body.otp) : '').trim();

    if (!isAdminEmail(email) || !otp) {
      return res.status(400).json({ verified: false, error: 'Invalid request' });
    }

    const record = await Otp.findOne({ email });
    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(401).json({ verified: false, error: 'Invalid or expired OTP' });
    }

    await Otp.deleteOne({ _id: record._id });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await AdminSession.create({ token, email, expiresAt });

    res.status(200).json({ verified: true, token, email, expiresAt });
  } catch (err) {
    res.status(500).json({ verified: false, error: 'Verification failed' });
  }
};

// POST /admin/logout   (Authorization: Bearer <token>)
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
