const express = require('express');

const router = express.Router();

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  checkID,
  checkBody,
} = require('../controllers/postController');

router.route('/').get(getPosts).post(checkBody, createPost);

router.param('id', checkID);

router
  .route('/:id')
  .get(getPostById)
  .put(checkBody, updatePost)
  .delete(deletePost);

module.exports = router;
