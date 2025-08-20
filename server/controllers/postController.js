const mongoose = require('mongoose');


// GET ALL POSTS HANDLER
exports.getPosts = (req, res) => {
  res.status(200).json({
    status: 200,
    results: posts.length,
    // data: {
    //   posts,
    // },
  });
};

// GET A POST HANDLER
exports.getPostById = (req, res) => {
  const post = posts.find((el) => el.id === parseInt(req.params.id));
  res.status(200).json(post);
};

// CREATE HANDLER
exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
    createdAt: new Date(),
  };
  res.status(201).json(newPost);
};

// UPDATE HANDLER
exports.updatePost = (req, res) => {
  const post = posts.find((el) => el.id === parseInt(req.params.id));
  const { title, content } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;
  res.status(200).json(post);
};

// DELETE HANDLER
exports.deletePost = (req, res) => {
  const filteredPosts = posts.filter((el) => el.id !== parseInt(req.params.id));
  if (filteredPosts.length === posts.length) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.status(200).json({
    status: 200,
    message: 'Post deleted',
    data: null,
  });
};
