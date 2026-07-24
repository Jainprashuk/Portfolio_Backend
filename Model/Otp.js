const mongoose = require('mongoose');

// Admin-login OTPs. DB-backed (not in-memory) so send/verify survive across
// separate serverless invocations. Auto-expires via TTL.
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
