const express = require('express');
const cors = require('cors');
const bearerToken = require('express-bearer-token');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRouter = require('./src/routes');

const app = module.exports = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bearerToken());

// Dev
app.use((req, res, next) => {
  console.log('Method=', req.method);
  console.log('req.headers=', req.headers);
  next();
});

if (!module.parent) { // I'm stand alone
  app.use('/api', apiRouter);

  mongoose.connect(process.env.DB_STRING, async () => {
    console.log('Connected');

    app.listen(PORT, () => {
      console.log(`Running at http://localhost:${PORT}`);
      console.log('secret', process.env.JWT_ACCESS_SECRET);
    });
  });
} else {
  app.use(apiRouter);
}
