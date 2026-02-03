/**
 * Role-Based Access Control middleware
 * Usage: rbac('Admin', 'Manager') or rbac(['Admin', 'Manager'])
 */
module.exports = (...allowedRoles) => {
  // Support both rbac('Admin','Manager') and rbac(['Admin'])
  const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userRole = String(req.user.role).toLowerCase();
    const allowed = roles.map(r => String(r).toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
