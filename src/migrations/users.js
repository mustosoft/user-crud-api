const bcrypt = require('bcrypt');

const { User } = require('../models');

const migrations = module.exports = {};

migrations.createInitialUsers = async () => {
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      name: 'Admin Satu',
      role: 'admin',
    },
    {
      username: 'user',
      password: 'user123',
      name: 'User Satu',
      role: 'user',
    },
  ];

  const inserted = await User.insertMany(users.map((user) => {
    const { password, ...userData } = user;

    return new User({
      ...userData,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    });
  }));

  console.log('inserted:', inserted);
};

migrations.resetUser = async () => {
  const result = await User.collection.drop();
  console.log('DB reset. Result:', result);
};
