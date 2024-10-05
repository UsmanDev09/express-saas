// const jwt = require('jsonwebtoken');
const passport = require('passport');
const authenticateUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred during authentication', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'An error occurred during login', error: err.message });
      }
      next();
    });
  })(req, res, next);
};
const isAuthenticated = (allowedStatuses) => (req, res, next) => {
  //The commented code is to check the authentication with jwt token
  // try {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  //   const token = authHeader.split(' ')[1];
  //   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decodedToken;
  //   next();
  // } catch (err) {
  //   res.status(401).json({ message: 'Unauthorized',error:err.message });
  // }
  try {
    console.log(req.user);
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'You must be logged in to access this route' });
    }

    if (!allowedStatuses.includes(req.user.status)) {
      return res.status(403).json({ message: 'User does not have the required status' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

// const validateRequest = (schema) => (req, res, next) => {
//   next();
// };

module.exports = {
  isAuthenticated,
  authenticateUser,
  // validateRequest,
}