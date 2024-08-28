require("dotenv").config();
const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const User = require('./userModel');

const UserGameProgress = sequelize.define('UserGameProgress', {
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
  },
  trivia_current_game_level_reached: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'trivia_current_game_level_reached',
  },
  grid_based_current_game_level_reached: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'grid_based_current_game_level_reached',
  },
  learning_path_current_game_level_reached: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'learning_path_current_game_level_reached',
  },
  role_playing_current_game_level_reached: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'role_playing_current_game_level_reached',
  },
  consecutive_right_answers_count: {
    type: DataTypes.JSON,
    defaultValue: {},
    field: 'consecutive_right_answers_count',
  },
  status: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
  },
  deleted: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  sequelize,
  tableName: 'user_game_progress',
  timestamps: false,
});

module.exports = UserGameProgress;
