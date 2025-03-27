const { createResponseError } = require("../helpers/responseHelper");

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
  // In a real app with sessions or JWT, you'd verify the token here
  // For now, we're checking if user info is in the request
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware to check if user is an admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// For demo purposes - extracts user from request headers
// In a real app, you would use JWT validation or session checks
function extractUser(req, res, next) {
  const userHeader = req.headers['x-user-info'];
  if (userHeader) {
    try {
      req.user = JSON.parse(userHeader);
    } catch (error) {
      console.error("Invalid user info in header", error);
    }
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  extractUser
};
