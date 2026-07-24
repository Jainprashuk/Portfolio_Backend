const express = require('express');
const requireAdmin = require('../Utils/requireAdmin.js');
const {
  getPublished,
  getPublishedBySlug,
  adminList,
  adminGet,
  adminCreate,
  adminUpdate,
  adminApprove,
  adminUnpublish,
  adminDelete,
} = require('../Controllers/PostController.js');

const router = express.Router();

// Public
router.get('/posts', getPublished);
router.get('/posts/:slug', getPublishedBySlug);

// Admin (guarded)
router.get('/admin/posts', requireAdmin, adminList);
router.get('/admin/posts/:slug', requireAdmin, adminGet);
router.post('/admin/posts', requireAdmin, adminCreate);
router.patch('/admin/posts/:slug', requireAdmin, adminUpdate);
router.post('/admin/posts/:slug/approve', requireAdmin, adminApprove);
router.post('/admin/posts/:slug/unpublish', requireAdmin, adminUnpublish);
router.delete('/admin/posts/:slug', requireAdmin, adminDelete);

module.exports = router;
