require("dotenv").config();
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const User = require('./userModel');
const FileEntity = require('./file.entity.model');
class Profile extends Model {}

Profile.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'phone_number',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true,
  },
  profileType: {
    type: DataTypes.ENUM('Student', 'Instructor', 'Admin'),
    allowNull: true,
    field: 'profile_type',
  },
  learningPace: {
    type: DataTypes.ENUM('Slow', 'Average', 'Fast'),
    allowNull: true,
    field: 'learning_pace',
  },
  profileLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'profile_level',
  },
  rubies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  exp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  energy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  spentIn: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'spent_in',
  },
  energyBackup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'energy_backup',
  },
  tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  streakSaver: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'streak_saver',
  },
  chestBoxes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: { rare: 0, epic: 0, legendary: 0 },
    field: 'chest_boxes',
  },
  powers: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
  eliteStatus: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    field: 'elite_status',
  },
  eliteSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'elite_subscription_id',
  },
  deleted: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
    field: 'updated_at',
  },
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'user_profiles',
  timestamps: false,
});
// Profile.belongsTo(User, {
//     foreignKey: 'user_id',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   });
  
  // Profile.belongsTo(FileEntity, {
  //   foreignKey: 'file_id',
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // });


module.exports = Profile;