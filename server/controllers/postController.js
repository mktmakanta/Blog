const Post = require('../models/Posts');

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find() //uncomment below lines later when relations are set up
      .populate('author', 'name email');
    // .populate('comments', 'content author')
    // .populate('categories', 'name')
    // .populate('tags', 'name')
    // .populate('likes', 'user');
    res.status(200).json({
      status: 200,
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to fetch posts',
      err,
    });
  }
};

// GET A POST BY ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id) //uncomment below lines later when relations are set up
      .populate('author', 'name email');
    // .populate('comments', 'content author')
    // .populate('categories', 'name')
    // .populate('tags', 'name')
    // .populate('likes', 'user');
    if (!post) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Post not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to fetch post',
      err,
    });
  }
};

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to create post',
      err,
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email');
    // .populate('comments', 'content author')
    // .populate('categories', 'name')
    // .populate('tags', 'name')
    // .populate('likes', 'user');
    if (!updatedPost) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Post not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { post: updatedPost },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to update post',
      err,
    });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Post not found' });
    }
    res.status(204).json({
      status: 'success',
      message: 'Post deleted',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to delete post',
      err,
    });
  }
};
