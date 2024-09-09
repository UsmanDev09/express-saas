const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const User = require('./userModel');

const UserSocials = sequelize.define('UserSocials', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  social_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('google', 'facebook', 'linkedIn'),
    allowNull: false,
  },
}, {
  tableName: 'user_socials',
  timestamps: false,
});

// Define the association with the User model
UserSocials.belongsTo(User, {
  foreignKey: 'user_id',
//   as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User.hasMany(UserSocials, {
//   foreignKey: 'user_id',
//   as: 'socials',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

module.exports = UserSocials;
