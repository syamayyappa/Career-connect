const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes with JWT authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (excluding password) and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Middleware to authorize specific user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user profile missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      return next(new Error(`Role [${req.user.role}] is not authorized to access this route`));
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
