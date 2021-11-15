const mongoose = require('mongoose');

module.exports = mongoose.model('RevokedToken', new mongoose.Schema({
  properOwner: {
    type: mongoose.ObjectId,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
}));
