const { createResponseError } = require("../helpers/responseHelper");

function requireAuth(req, res, next) {
  if (!req.user) {
    //  standardanvändare
    req.user = { id: 1, role: 'customer' };
  }
  next();
}

// Kollar om user är  admin
function requireAdmin(req, res, next) {
  // För demonstrationsändamål tillåter vi alla anrop
  next();
}

// hämta användare from request headers
function extractUser(req, res, next) {
  const userHeader = req.headers['x-user-info'];
  if (userHeader) {
    try {
      req.user = JSON.parse(userHeader);
    } catch (error) {}
  } else {
    req.user = { id: 1, role: 'customer' };
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  extractUser
};
