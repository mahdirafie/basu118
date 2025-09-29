const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT and attach decoded info to req.user
 * @param {Array} roles Optional array of allowed roles. If omitted, any role is allowed.
 */
function isAuth(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "No token provided" });

      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Invalid token format" });

      const decoded = jwt.verify(token, "secret@basu");
      req.user = decoded; // uid, phone, role, emp_id (if employee)

      // check role if allowedRoles specified
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
  };
}

module.exports = isAuth;
