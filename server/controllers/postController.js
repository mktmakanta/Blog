const fs = require('fs');

const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'posts.json');

function readPosts() {
  if (!fs.existsSync(dataFile)) return [];
  const data = fs.readFileSync(dataFile, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function writePosts(posts) {
  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));
}

// CHECK ID MIDDLEWARE
exports.checkID = (req, res, next, val) => {
  const posts = readPosts();
  if (!posts.find((el) => el.id === parseInt(val))) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// CHECK BODY MIDDLEWARE
exports.checkBody = (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({
      status: 'fail',
      message: 'Title and content are required',
    });
  }
  next();
};

// GET ALL POSTS HANDLER
exports.getPosts = (req, res) => {
  const posts = readPosts();
  res.status(200).json({
    status: 200,
    results: posts.length,
    data: {
      posts,
    },
  });
};

// GET A POST HANDLER
exports.getPostById = (req, res) => {
  const posts = readPosts();
  const post = posts.find((el) => el.id === parseInt(req.params.id));
  res.status(200).json(post);
};

// CREATE HANDLER
exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const posts = readPosts();
  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
    createdAt: new Date(),
  };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
};

// UPDATE HANDLER
exports.updatePost = (req, res) => {
  const posts = readPosts();
  const post = posts.find((el) => el.id === parseInt(req.params.id));
  const { title, content } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;
  writePosts(posts);
  res.status(200).json(post);
};

// DELETE HANDLER
exports.deletePost = (req, res) => {
  const posts = readPosts();
  const filteredPosts = posts.filter((el) => el.id !== parseInt(req.params.id));
  if (filteredPosts.length === posts.length) {
    return res.status(404).json({ message: 'Post not found' });
  }
  writePosts(filteredPosts);
  res.status(200).json({
    status: 200,
    message: 'Post deleted',
    data: null,
  });
};
