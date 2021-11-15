const bcrypt = require('bcrypt');

const { registerValidator, userValidator } = require('../validators');
const { User } = require('../models');

/**
 * User controllers
 */
const userController = module.exports = {};

userController.createUser = async function createUser(req, res) {
  const { body } = req;
  const { error, value: cleanedData } = registerValidator(body);

  if (error) {
    const responseBody = { errors: [] };

    error.details.forEach((e) => {
      responseBody.errors.push({ field: e.context.key, message: e.message });
    });
    res.status(400);
    res.send(responseBody);
  } else {
    // find by username
    const {
      username,
      password,
      name,
      role,
    } = cleanedData;
    let user = await User.findOne({ username });

    if (user) {
      res.status(409);
      res.send({ message: 'Username already taken' });
      return;
    }

    // create new user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      name,
      role,
      password: hashedPassword,
    });

    try {
      const saved = await user.save();
      res.status(201);
      res.send({
        message: 'User created',
        result: saved,
      });
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ message: 'Internal server error' });
    }
  }
};

userController.getAllUsers = async function getAllUsers(req, res) {
  try {
    const users = await User.find({});

    res.send({
      message: 'Success',
      result: users,
    });
  } catch (e) {
    res.status(500);
    res.send({ message: 'Internal server error' });
  }
};

userController.getUser = async function getUser(req, res) {
  const { id } = req.params;
  let user;

  try {
    if (req.user.role === 'admin' || (req.user.role === 'user' && req.user.id === id)) {
      // user only allowed to get its own data
      user = await User.findById(id);

      req.status(user ? 200 : 404);
      req.send({
        message: user ? 'Success' : 'Not found',
        result: user || null,
      });
    } else {
      res.status(403);
      res.send({ message: 'Forbidden' });
    }
  } catch (e) {
    res.status(500);
    res.send({ message: 'Internal server error' });
  }
};

userController.updateUser = async function updateUser(req, res) {
  const { id } = req.params;
  const { method, body } = req;

  const { error, value: cleanedData } = userValidator(body);

  if (error) {
    const responseBody = { errors: [] };

    error.details.forEach((e) => {
      responseBody.errors.push({ field: e.context.key, message: e.message });
    });
    res.status(400);
    res.send(responseBody);
    return;
  }

  switch (method) {
    case 'put':
      try {
        const updatedData = await User.findByIdAndUpdate(id, {
          $set: { ...cleanedData },
        }, { new: true });
        res.send({ message: 'User updated', result: updatedData });
      } catch (e) {
        res.status(500);
        res.send({ message: 'Internal server error' });
      }
      break;

    case 'patch':
      // Currently unimplemented
      res.status(404);
      res.send({ message: 'Unimplemented' });
      break;

    default:
      break;
  }
};

userController.deleteUser = async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await User.findByIdAndRemove(id);
    res.send({ message: 'User deleted' });
  } catch (e) {
    res.status(500);
    res.send({ message: 'Internal server error' });
  }
};
