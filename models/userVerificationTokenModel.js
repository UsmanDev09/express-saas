require("dotenv").config();
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const User = require('./userModel'); 
const VerificationTokenType = require('../enums/verification-token-type.enum');

const UsersVerificationToken = sequelize.define('UsersVerificationToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM(VerificationTokenType.VerifyEmail, VerificationTokenType.PasswordReset),
    allowNull: false,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expire_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users_verification_tokens',
  timestamps: false,
});

// Static Methods
UsersVerificationToken.makeVerifyEmail = function (id, token, expire) {
  return UsersVerificationToken.create({
    id,
    type: VerificationTokenType.VerifyEmail,
    token,
    submittedAt: new Date(),
    expireAt: new Date(Date.now() + expire),
  });
};

UsersVerificationToken.makePasswordReset = function (id) {
  return UsersVerificationToken.create({
    id,
    type: VerificationTokenType.PasswordReset,
    submittedAt: new Date(),
  });
};

// Instance Methods
UsersVerificationToken.prototype.isPasswordReset = function () {
  return this.type === VerificationTokenType.PasswordReset;
};

UsersVerificationToken.prototype.isVerifyEmail = function () {
  return this.type === VerificationTokenType.VerifyEmail;
};

module.exports = UsersVerificationToken;