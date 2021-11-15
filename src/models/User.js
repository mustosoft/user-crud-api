const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  refreshTokens: [new mongoose.Schema({
    value: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  })],
}));
