const express = require('express');
const { topPosts } = require('../controllers/postController');

const router = express.Router();

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.route('/top-5-posts').get(topPosts, getPosts);
router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

module.exports = router;
