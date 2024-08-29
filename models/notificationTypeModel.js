const { DataTypes, Model,Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);

class NotificationType extends Model {}

NotificationType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    notification_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    is_system_generated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'NotificationType',
    tableName: 'notification_types',
    timestamps: true,
    underscored: true,
  }
);
module.exports = NotificationType;
