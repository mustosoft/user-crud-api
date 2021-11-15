const { refreshToken, login, logout } = require('./auth');
const {
  createUser, getAllUsers, getUser, updateUser, deleteUser,
} = require('./users');

module.exports = {
  // Auth
  refreshToken,
  login,
  logout,

  // Users
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
