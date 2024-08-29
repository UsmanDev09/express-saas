const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const MailerService = require('../services/mailerService');
const HasherService = require('../services/hasherService');
const userService = require('./userServices');
const profileService = require('./profileService');
const NotificationService = require('./notificationService');
const UsersVerificationToken = require('../models/userVerificationTokenModel');
const energyConstants = require('../constants/energyConstants');
const Profile = require('../models/profilesModel');
const UserGameProgress = require('../models/usergameProgessModel');
const VerificationTokenType = require("../enums/verification-token-type.enum");
const UserStatus = require("../enums/user-status");
const signIn = async (user) => {
  try {
    const foundUser = await userService.findByEmail(user.email);
    if (!foundUser) {
      throw new Error("User not found");
    }
    return createJwtTokenPair(foundUser);

  } catch (error) {
    throw new Error("Error in sign in");
  }
};

const signUp = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  let username = email.split('@')[0];
  const usernameCount = await User.count({
    where: { username: { [Op.like]: `${username}%` } },
  });

  if (usernameCount > 0) {
    username = `${username}${usernameCount}`;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    profile: { energy: energyConstants.maxPoints },
    gameProgress: {},
  }, {
    include: [{ model: Profile, as: 'profile' },
    { model: UserGameProgress, as: 'gameProgress' }],
  });

  // Send welcome notification
  // await notificationService.sendWelcomeNotification(user);

  // Send verification email
  await sendVerifyEmail(user.id);
}

const sendVerifyEmail = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: UsersVerificationToken, as: 'tokens' }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified || user.isActive) {
      return { message: "Email verified" };
    }

    const token = user.tokens.find(t => t.isVerifyEmail);
    const canSubmit = !token || (new Date() - token.submittedAt) >= 60000;
    if (user.isPending && canSubmit) {
      const verificationToken = await UsersVerificationToken.create({
        user_id: user.id,
        type:VerificationTokenType.VerifyEmail,
        token: jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' }),
      });
      await MailerService.sendVerificationEmail(user.email, verificationToken.token, user.name);
    }
    return { message: "Email sent" };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send verification email');
  }
};

const verifyEmail = async (userId, code) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: UsersVerificationToken, as: 'tokens' }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = user.tokens.find(t => t.token === code && t.isVerifyEmail);
    if (!token) {
      throw new Error('Invalid token');
    }

    // Verify email
    await user.update({
      status: UserStatus.Verified,
      email_verified: new Date(),
    }
    );
    return { message: "Email verified" };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify email');
  }
};

const sendForgotPasswordEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Save reset token
  await UsersVerificationToken.create({
    user_id: user.id,
    token,
    type: VerificationTokenType.PasswordReset,
  });

  await MailerService.sendForgotPasswordEmail(user.email, token);
  return { message:"Reset Email sent successfully" };
};

const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    return { message: "User password changed successfully" };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      throw new Error('User not found');
    }

    return createJwtTokenPair(user);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

const createJwtTokenPair = async (user) => {
  const payload = { email: user.email, sub: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const getProfile = async (user) => {
  try {
    const userProfile = await profileService.getProfile(user.sub);
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    return userProfile;
  } catch (error) {
    throw new Error('Error retrieving user profile: ' + error.message);
  }
};

const getFirebaseCustomToken = async (userId) => {
  // Logic to get Firebase custom token
};
module.exports={
  signIn,
  signUp,
  sendVerifyEmail,
  verifyEmail,
  sendForgotPasswordEmail,
  resetPassword,
  refreshAccessToken,
  getProfile,
  getFirebaseCustomToken,
}