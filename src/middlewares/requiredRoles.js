const o = module.exports = {};

o.requiredRoles = function requiredRoles(roles) {
  if (!Array.isArray(roles)) { throw TypeError('The type `roles` must be array'); }

  return function middleware(req, res, next) {
    const { user: { role = null } = {} } = req;

    if (!role || !roles.includes(role)) {
      res.status(403);
      res.send({ message: 'Forbidden' });
    }

    next();
  };
};
