require('../middlewares/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/index');

// Auth Routes
// router.post('/sign-in'/*, authController.signIn*/,passport.authenticate('local',{successRedirect:'/'}));
router.post('/sign-in', (req, res, next) => {
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
        return res.status(200).json({ message: 'Authentication successful', user: { id: user.id, email: user.email } });
      });
    })(req, res, next);
  });
router.post('/sign-up',authController.signUp);
router.post('/sign-out',auth.isAuthenticated(['active','pending','verified']),authController.signOut); 
router.post('/confirm/email', auth.isAuthenticated(['pending']), authController.confirmEmail);
router.post('/confirm/email/resend', auth.isAuthenticated(['pending']), authController.resendConfirmEmail);
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('Facebook authentication successful');
    res.redirect('/');
  }
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('Google authentication successful');
    res.redirect('/');
  }
);
// router.post('/linkedin', authController.linkedinAuth);
router.post('/password/forgot', authController.forgotPassword);
router.put('/password/reset',authController.resetPassword);
router.post('/refresh', authController.refreshAccessToken);
router.get('/profile', auth.isAuthenticated(['active', 'pending','verified']), authController.getProfile);
router.get('/firebase/token', auth.isAuthenticated(['pending','active']), authController.getFirebaseToken);

module.exports = router;
