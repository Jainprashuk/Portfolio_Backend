const mongoose = require('mongoose');

// Short-lived admin sessions issued after a successful OTP verify.
const adminSessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// TTL index: Mongo removes the session automatically once it expires.
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema);
