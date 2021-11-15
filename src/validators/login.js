const Joi = require('joi');

module.exports = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Invalid username',
      'string.min': 'Minimum username length is 3',
      'string.max': 'Maximum username length is 30',
      'string.empty': 'Enter username',
    }),

  password: Joi.string()
    .min(6)
    .max(64)
    .required()
    .messages({
      'string.min': 'Minimum password length is 6',
      'string.max': 'Maximum password length is 64',
      'string.empty': 'Enter password',
    }),
});
