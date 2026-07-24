const Post = require('../Model/Post.js');

const SLUG_RE = /^[a-z0-9-]+$/;
const isValidSlug = (s) => typeof s === 'string' && SLUG_RE.test(s) && !s.includes('..');

const readTimeOf = (content) => {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// ---- Public reads (published only) ----

// GET /posts -> published posts, newest first. Content is stripped for payload
// size but a computed readTime is included for the list cards.
exports.getPublished = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }, { __v: 0 }).sort({ date: -1 });
    const list = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      status: p.status,
      aiAssisted: p.aiAssisted,
      readTime: readTimeOf(p.content),
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /posts/:slug -> a single published post (with content).
exports.getPublishedBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' }, { __v: 0 });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Admin (guarded) ----

// GET /admin/posts?status=draft -> all posts (optionally filtered by status).
exports.adminList = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const posts = await Post.find(filter, { __v: 0 }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /admin/posts/:slug -> a single post regardless of status (for preview).
exports.adminGet = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }, { __v: 0 });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /admin/posts -> create a draft (used by the CI generator).
exports.adminCreate = async (req, res) => {
  try {
    const { slug, title, description, content, date, aiAssisted, status } = req.body || {};
    if (!isValidSlug(slug)) return res.status(400).json({ message: 'Invalid slug' });
    if (!title) return res.status(400).json({ message: 'Title required' });

    const exists = await Post.findOne({ slug });
    if (exists) return res.status(409).json({ message: 'Slug already exists' });

    const post = await Post.create({
      slug,
      title,
      description: description || '',
      content: content || '',
      date: date ? new Date(date) : new Date(),
      // Defaults to draft; migration may seed already-published posts.
      status: status === 'published' ? 'published' : 'draft',
      aiAssisted: aiAssisted !== false,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /admin/posts/:slug -> edit title/description/content (e.g. to resolve
// [AUTHOR:] markers before publishing).
exports.adminUpdate = async (req, res) => {
  try {
    const { title, description, content } = req.body || {};
    const update = {};
    if (typeof title === 'string' && title.trim()) update.title = title;
    if (typeof description === 'string') update.description = description;
    if (typeof content === 'string') update.content = content;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const post = await Post.findOneAndUpdate({ slug: req.params.slug }, update, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /admin/posts/:slug/approve -> flip a draft to published.
exports.adminApprove = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { status: 'published' },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /admin/posts/:slug/unpublish -> flip back to draft.
exports.adminUnpublish = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { status: 'draft' },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /admin/posts/:slug -> remove a post.
exports.adminDelete = async (req, res) => {
  try {
    const r = await Post.deleteOne({ slug: req.params.slug });
    if (r.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true, slug: req.params.slug });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
