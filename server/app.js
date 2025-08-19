const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const app = express();
const morgan = require('morgan');

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', usersRoutes);

module.exports = app;
