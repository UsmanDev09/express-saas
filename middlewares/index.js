const jwt = require('jsonwebtoken');
require("dotenv").config();

const isAuthenticated = (...statuses) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded token",decodedToken);
    req.user = decodedToken;
    // console.log("The user is: ",req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const validateRequest = (schema) => (req, res, next) => {
  next();
};

module.exports = {
  isAuthenticated,
  validateRequest,
}