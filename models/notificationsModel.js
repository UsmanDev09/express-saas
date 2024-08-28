const { DataTypes, Model,Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const Profile = require('./profilesModel');
const notificationType=require('./notificationTypeModel');
const NotificationGroup = require('./userNotificationGroupModel');

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  notification_type_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  from_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  notification_message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notification_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_action: {
    type: DataTypes.STRING,
    defaultValue: 'unread',
  },
  user_request_action: {
    type: DataTypes.STRING,
    defaultValue: 'no-action',
  },
  system_notification_readed_by: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  system_notification_deleted_by: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'notifications',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations

// Notification.belongsTo(Profile, {
//   foreignKey: 'user_id',
//   as: 'user',
// });

// Notification.belongsTo(Profile, {
//   foreignKey: 'from_user_id',
//   as: 'fromUser',
// });
// Notification.belongsTo(notificationType, {
//   foreignKey: 'notification_type_id',
//   // as: 'notificationType',
// });
// Notification.belongsTo(NotificationGroup, {
//   foreignKey: 'group_id',
//   // as: 'NotificationGroup',
// });

module.exports = Notification;
