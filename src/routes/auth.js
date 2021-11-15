const { login, logout, refreshToken } = require('../controllers');

const router = module.exports = require('express').Router();

router.post('/refresh_token', refreshToken);
router.post('/login', login);
router.post('/logout', logout);
