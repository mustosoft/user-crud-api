const mongoose = require('mongoose');
require('dotenv').config();

const { createInitialUsers, resetUser } = require('./users');

async function migrateUser() {
  await resetUser();
  await createInitialUsers();
}

mongoose.connect(process.env.DB_STRING, async () => {
  console.log('Connected');
  await migrateUser();
  await this.disconnect();
});
