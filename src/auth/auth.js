const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuid4 } = require('uuid');

const { User } = require('../models');

/**
 * Authentication
 */
const o = module.exports = {};

// Validate access token (jwt)
o.verifyToken = function verifyToken(token) {
  try {
    return {
      error: null,
      data: jwt.verify(token, process.env.JWT_ACCESS_SECRET),
    };
  } catch (e) {
    return {
      error: Error('Invalid token'),
      data: null,
    };
  }
};

// Validate refreshToken given by user,
// if invalid, pop it from refreshTokens
o.validateRefreshToken = async function validateRefreshToken(refreshToken, userId) {
  const user = await User.findById(userId);

  if (!user) throw Error('User not found');

  const { refreshTokens: userTokens } = user;
  const found = userTokens.find((token) => token.value === refreshToken);

  if (typeof found === 'undefined') return false;

  if (found.expiredAt <= Date.now()) { // expired, pop from db
    user.refreshTokens = user.refreshTokens.filter((token) => token.value !== refreshToken);
    await user.save();
    return false;
  }

  return true;
};

o.generateRefreshToken = function generateRefreshToken() {
  return uuid4();
};

// Creates new refresh token and sends it back.
// Usually called when user just signin
o.createRefreshToken = async function createRefreshTokenUser(user, cb) {
  const newToken = o.generateRefreshToken();

  const expire = Date.now() + Number(process.env.REFRESH_EXP);
  try {
    await User.findByIdAndUpdate(user.id, {
      $push: {
        refreshTokens: {
          value: newToken,
          expiredAt: expire,
        },
      },
    });
    if (cb) cb(newToken);
    return newToken;
  } catch (e) {
    throw Error(e.message);
  }
};

// Generate new access token, user requests
// by giving its refresh token
o.generateAccessToken = function generateAccessToken(user) {
  const { _id, username, role } = user;

  return jwt.sign(
    {
      username,
      role,
      id: _id,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: Number(process.env.ACCESS_EXP),
    },
  );
};

// Authorize token, is it expired or not
o.authorizer = function auth(req, res, next) {
  if (!req.token) {
    res.status(401).send({ message: 'Unauthorized' });
    return false;
  }

  const { error, data } = o.verifyToken(req.token);

  if (error) {
    res.status(401).send({ message: error.message });
    return false;
  }

  req.user = data;
  if (next) next();
  return data;
};

// Lookup user's data on db and returns user object
o.authenticator = async function authenticator(username, password, cb) {
  // check user existence
  const user = await User.findOne({ username });

  if (!user) {
    const result = { error: Error('User not found'), user: null };
    if (cb) cb(result);
    return result;
  }

  const valid = await bcrypt.compare(password, user.password);
  const result = {
    error: valid ? null : Error('Invalid password'),
    user: valid ? user : null,
  };
  if (cb) cb(result);
  return result;
};
