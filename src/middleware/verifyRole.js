// /src/middleware/verifyRole.js
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming you have a 'role' property in your user object
    var verified = true;
    if (Array.isArray(requiredRole)) {
      // Check if user has at least one of the required roles
      if (!requiredRole.includes(userRole)) {
        verified = false;
      }
    } else {
      // Check if user has the single required role
      if (userRole !== requiredRole) {
        verified = false;
      }
    }

    if(!verified){
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    
    // if (userRole !== requiredRole) {
    //   return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    // }

    next();
  };
};

module.exports = verifyRole;
