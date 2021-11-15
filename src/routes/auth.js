const { login, logout } = require('../controllers');

const router = module.exports = require('express').Router();

router.post('/login', login);
router.post('/logout', logout);
