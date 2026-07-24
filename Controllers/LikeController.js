const Like = require('../Model/Like.js');

// GET /likes -> [{ slug, count }]  (all counts, for the blog list)
exports.getAllLikes = async (req, res) => {
  try {
    const likes = await Like.find({}, { _id: 0, slug: 1, count: 1 });
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /likes/:slug -> { slug, count }
exports.getLike = async (req, res) => {
  try {
    const doc = await Like.findOne({ slug: req.params.slug });
    res.json({ slug: req.params.slug, count: doc ? doc.count : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /likes/:slug  body: { liked: boolean }
// liked=true increments, liked=false decrements (never below 0).
// The client remembers its own like state (localStorage); the server just
// keeps the running total.
exports.toggleLike = async (req, res) => {
  try {
    const { slug } = req.params;
    const delta = req.body && req.body.liked === false ? -1 : 1;

    const doc = await Like.findOneAndUpdate(
      { slug },
      { $inc: { count: delta } },
      { new: true, upsert: true }
    );

    // Clamp a negative count back to 0 if a stale unlike underflowed it.
    if (doc.count < 0) {
      doc.count = 0;
      await doc.save();
    }

    res.json({ slug, count: doc.count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
