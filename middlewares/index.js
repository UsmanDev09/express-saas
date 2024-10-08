const jwt = require('jsonwebtoken');
const isAuthenticated = () => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized',error:err.message });
  }
};

// const validateRequest = (schema) => (req, res, next) => {
//   next();
// };

module.exports = {
  isAuthenticated,
  // validateRequest,
}