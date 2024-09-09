const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy=require('passport-facebook');
const UserModel = require('../models/userModel');
const Profile = require('../models/profilesModel');
const UserProgress = require('../models/userProgressModel');
const UserGameProgress = require('../models/usergameProgessModel');
const UserSocials = require('../models/userSocialModel');
const energyConstants = require('../constants/energyConstants');
const UserStatus = require("../enums/user-status");
const UserRole = require('../enums/user-role');
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ where: { email: email } });
      
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback",
  passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await UserModel.findOne({ where: { email: profile.emails[0].value } });

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails[0].value;
    const given_name = profile.name.givenName;
    const family_name = profile.name.familyName;

    let username = email.split('@')[0];
    const usernameCount = await UserModel.count({
      where: { username: { [Op.like]: `${username}%` } },
    });

    if (usernameCount > 0) {
      username = `${username}_${usernameCount}`;
    }

    const user = await UserModel.create({
      email,
      name: `${given_name}`.trim() || email.replace(/@.+/, '') || `${family_name}`.trim(),
      username,
      status: UserStatus.Active,
      role: UserRole.User,
      email_verified: new Date(),
      socials: [new UserSocials({ social_id: profile.id, type: 'google' })],
      progress: {},
      gameProgress: {},
      profile: { energy: energyConstants.maxPoints }
    }, {
      include: [
        { model: UserSocials, as: 'socials' },
        { model: UserProgress, as: 'progress' },
        { model: UserGameProgress, as: 'gameProgress' },
        { model: Profile, as: 'profile' }
      ],
    });

    return done(null, user);

  } catch (err) {
    return done(err);
  }
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3001/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'displayName'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await UserModel.findOne({ where: { email: profile.emails[0].value } });

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails[0].value;
    const displayName = profile.displayName;
    let username = displayName.split(' ')[0];

    const usernameCount = await UserModel.count({
      where: { username: { [Op.like]: `${username}%` } },
    });

    if (usernameCount > 0) {
      username = `${username}_${usernameCount}`;
    }

    const user = await UserModel.create({
      email,
      name: displayName,
      username,
      status: UserStatus.Active,
      role: UserRole.User,
      email_verified: new Date(),
      socials: [{ social_id: profile.id, type: 'facebook' }],
      progress: {},
      gameProgress: {},
      profile: { energy: energyConstants.maxPoints }
    }, {
      include: [
        { model: UserSocials, as: 'socials' },
        { model: UserProgress, as: 'progress' },
        { model: UserGameProgress, as: 'gameProgress' },
        { model: Profile, as: 'profile' }
      ],
    });

    return done(null, user);

  } catch (err) {
    return done(err);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await UserModel.findByPk(id);
    const user = {
        sub: foundUser.id,  
        email: foundUser.email,
        status:foundUser.status,
      };
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;