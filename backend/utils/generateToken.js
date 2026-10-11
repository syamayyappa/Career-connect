const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'careerconnect_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d' // Token valid for 30 days
  });
};

module.exports = generateToken;
