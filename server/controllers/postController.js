const Post = require('../models/Posts');

// GET TOP 5 POSTS USING ALIASING
exports.topPosts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'title,createdAt';
  req.query.fields = 'title,author,createdAt';
  next();
};
// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    console.log(req.query);

    // 1) FILTERING
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Post.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numPosts = await Post.countDocuments();
      if (skip >= numPosts) throw new Error('This page does not exist');
    }
    const posts = await query.populate('author', 'name email');
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
