const { User } = require('../models');
const { loginValidator } = require('../validators');
const {
  authenticator, generateAccessToken, createRefreshToken, validateRefreshToken,
} = require('../auth');

const authController = module.exports = {};

// Authenticates user and sends back access token and refresh token
authController.login = async (req, res) => {
  // Validate login data
  const { body } = req;
  const { error, value: cleanedData } = loginValidator.validate(body);

  if (error) { // fields validation error
    const responseBody = { errors: [] };

    error.details.forEach((e) => {
      responseBody.errors.push({ field: e.context.key, message: e.message });
    });
    res.status(400);
    res.send(responseBody);
    return;
  }

  // Authentication
  const { username, password } = cleanedData;
  authenticator(username, password, async ({ error: e, user }) => {
    if (e) {
      res.status(401);
      res.send({ message: 'Username or password wrong' });
      return;
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await createRefreshToken(user);

    res.status(200);
    // rfc6749 standard for OAuth 2.0 protocol
    res.set({
      Pragma: 'no-cache',
      'Cache-Control': 'no-store',
    });
    res.send({
      access_token: accessToken,
      token_type: 'jwt',
      expires_in: process.env.ACCESS_EXP,
      refresh_token: newRefreshToken,
      user: {
        username: user.name,
        id: user._id,
        role: user.role,
      },
    });
  });
};

/**
 * Logging out deletes valid refreshToken from user
 */
authController.logout = async (req, res) => {
  const { refreshToken, user: { id: userId } = {} } = req.body;

  if (refreshToken && userId) {
    try {
      const valid = await validateRefreshToken(refreshToken, userId);

      if (!valid) {
        res.status(401);
        res.send({
          message: 'Unauthorized',
          action: 'forget', // already logged out or invalid
        });
      }

      // Delete refresh token from user;
      const user = await User.findById(userId);
      user.refreshTokens = user.refreshTokens.filter((token) => token.value !== refreshToken);
      await user.save();
      res.status(200);
      res.send({ message: 'Logout success' });
    } catch (e) {
      res.status(500);
      res.send({ message: e.message });
      return;
    }
  }

  res.status(400);
  res.send({ message: 'Bad request' });
};

authController.refreshToken = async (req, res) => {
  const { refreshToken, user: { id: userId } = {} } = req.body;

  try {
    const valid = await validateRefreshToken(refreshToken, userId);

    if (valid) {
      const user = await User.findById(userId);
      const accessToken = generateAccessToken(user);

      res.status(200);
      // rfc6749 standard for OAuth 2.0 protocol
      res.set({
        Pragma: 'no-cache',
        'Cache-Control': 'no-store',
      });
      res.send({
        access_token: accessToken,
        token_type: 'jwt',
        expires_in: process.env.ACCESS_EXP,
      });
    }

    res.status(401);
    res.send({ message: 'Unauthorized' });
    return;
  } catch (e) {
    res.status(500);
    res.send({ message: e.message });
  }
};
