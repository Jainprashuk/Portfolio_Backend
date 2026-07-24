const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  // Original markdown body (no frontmatter).
  content: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  aiAssisted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
