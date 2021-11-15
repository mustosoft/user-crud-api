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

  users.forEach(async (user) => {
    const { password, ...userData } = user;

    const newUser = new User({
      ...userData,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    });

    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);
  });
};

migrations.resetUser = async () => {
  const result = await User.collection.drop();
  console.log('DB reset. Result:', result);
};
