const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Guard against model recompilation on serverless warm invocations.
module.exports = mongoose.models.Like || mongoose.model('Like', likeSchema);
