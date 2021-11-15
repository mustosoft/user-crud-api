const Joi = require('joi');

module.exports = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(6)
    .max(64)
    .required(),

  name: Joi.string()
    .regex(/^[a-zA-Z ]+$/)
    .trim()
    .required(),

  role: Joi.string()
    .valid('admin', 'user')
    .required(),
});
