let users = require('../data/users');

exports.validateUserId = (req, res, next, val) => {
  const user = users.find((el) => el.id === parseInt(val));
  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'Invalid user ID' });
  }
  next();
};

// GET ALL USERS HANDLER
exports.getUsers = (req, res) => {
  res.status(200).json({
    status: 200,
    results: users.length,
    data: users,
  });
};

// GET A USER HANDLER
exports.getUserById = (req, res) => {
  const user = users.find((el) => el.id === parseInt(req.params.id));
  res.status(200).json(user);
};

// ADD NEW USER HANDLER
exports.createUser = (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({
      error: "Either 'name' or 'role' are required",
    });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    role,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

// UPDATE HANDLER
exports.updateUser = (req, res) => {
  const user = users.find((el) => el.id === parseInt(req.params.id));
  user.name = req.body.name || user.name;
  user.role = req.body.role || user.role;
  res.status(200).json(user);
};

// DELETE HANDLER
exports.deleteUser = (req, res) => {
  const initialLength = users.length;
  users = users.filter((el) => el.id !== parseInt(req.params.id));
  if (users.length === initialLength) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted' });
};
