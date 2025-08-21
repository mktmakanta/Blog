const express = require('express');

const router = express.Router();

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.route('/').get(getPosts).post(createPost);

// router.param('id', checkID);

router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

module.exports = router;
