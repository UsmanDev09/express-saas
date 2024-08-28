const authService = require('../services/authService');
const firebaseService = require('../services/firebaseService');

exports.signIn = async (req, res) => {
  try {
    const tokenPair = await authService.signIn(req.body);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const tokenPair = await authService.signUp(req.body);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const response = await authService.verifyEmail(req.user.sub, req.body.code);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resendConfirmEmail = async (req, res) => {
  try {
    const response = await authService.sendVerifyEmail(req.user.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.facebookAuth = async (req, res) => {
  try {
    const tokenPair = await authService.createJwtTokenPair(req.user);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const tokenPair = await authService.createJwtTokenPair(req.user);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.linkedinAuth = async (req, res) => {
  try {
    const tokenPair = await authService.createJwtTokenPair(req.user);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const response = await authService.sendForgotPasswordEmail(req.body.email);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const response = await authService.resetPassword(req.body.token, req.body.password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const tokenPair = await authService.refreshAccessToken(req.body.refreshToken);
    res.json(tokenPair);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userProfile = await authService.getProfile(req.user);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFirebaseToken = async (req, res) => {
  try {
    // console.log("req user email",req.user.email);

    const token = await firebaseService.getCustomToken(req.user.email);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
