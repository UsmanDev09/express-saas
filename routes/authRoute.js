const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/index');

// Auth Routes
router.post('/sign-in', authController.signIn);
router.post('/sign-up',authController.signUp);
router.post('/confirm/email', auth.isAuthenticated('Pending'), authController.confirmEmail);
router.post('/confirm/email/resend', auth.isAuthenticated('Pending'), authController.resendConfirmEmail);
// router.post('/facebook', authController.facebookAuth);
// router.post('/google', authController.googleAuth);
// router.post('/linkedin', authController.linkedinAuth);
router.post('/password/forgot', authController.forgotPassword);
router.put('/password/reset',authController.resetPassword);
router.post('/refresh', authController.refreshAccessToken);
router.get('/profile', auth.isAuthenticated('Active', 'Pending', 'Verified'), authController.getProfile);
router.get('/firebase/token', auth.isAuthenticated('Pending', 'Verified', 'Active'), authController.getFirebaseToken);

module.exports = router;
