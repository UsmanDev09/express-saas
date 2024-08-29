const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const UserStatus = require('../enums/user-status');
class User extends Model {
  hasSocial(socialId, type) {
    return this.socials.find((item) => item.socialId === socialId && item.type === type);
  }

  getSocialByType(type) {
    return this.socials.find((item) => item.type === type);
  }

  get isBlocked() {
    return this.status === UserStatus.Blocked;
  }

  get isVerified() {
    return this.status === UserStatus.Verified;
  }

  get isPending() {
    return this.status === UserStatus.Pending;
  }

  get isActive() {
    return this.status === UserStatus.Active;
  }

  get isAdmin() {
    return this.role === UserRole.Admin;
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'blocked', 'verified'),
    defaultValue: 'pending',
  },
  diamonds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  email_verified: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
