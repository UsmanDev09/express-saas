const { Model, DataTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`); 
class UserProgress extends Model {}

UserProgress.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
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
  powers: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  sequelize,
  modelName: 'UserProgress',
  tableName: 'user_progress',
  timestamps: false,
});

module.exports = UserProgress;
