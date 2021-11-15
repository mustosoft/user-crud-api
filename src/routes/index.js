const { authorizer: auth } = require('../auth');

/**
 * API router
 */

const router = module.exports = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', auth, require('./users'));
