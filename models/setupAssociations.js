const User = require('./userModel');
const UsersToSkills = require('./userToSkillsModel');
const SoftSkill = require('./softskillsModel');
const UserLeaderboards = require('./leaderboardModel');
const Notification = require('./notificationsModel');
const Profile = require('./profilesModel');
const NotificationType = require('./notificationTypeModel');
const NotificationGroup = require('./userNotificationGroupModel');
const FileEntity = require('./file.entity.model');
const UsersToFriends = require('./userFriendsModel');
const UserProgress = require('./userProgressModel');
const UsersVerificationToken = require('./userVerificationTokenModel');
const UserGameProgress = require('./usergameProgessModel');
function setupAssociations() {
  User.hasMany(UsersToSkills, { foreignKey: 'user_id', as: 'usersToSkills', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasMany(UsersVerificationToken, { foreignKey: 'user_id', as: 'tokens', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  User.hasOne(UserGameProgress, { foreignKey: 'user_id', as: 'gameProgress', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

  UserGameProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });

  UsersVerificationToken.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  UsersToSkills.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  UsersToSkills.belongsTo(SoftSkill, {
    foreignKey: 'soft_skill_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserLeaderboards.belongsTo(User, {
    foreignKey: 'user_id',
  });
  
Notification.belongsTo(Profile, {
    foreignKey: 'user_id',
    as: 'user',
  });
  
  Notification.belongsTo(Profile, {
    foreignKey: 'from_user_id',
    as: 'fromUser',
  });
  Notification.belongsTo(NotificationType, {
    foreignKey: 'notification_type_id',
    // as: 'notificationType',
  });
  Notification.belongsTo(NotificationGroup, {
    foreignKey: 'group_id',
    // as: 'NotificationGroup',
  });
  
  Profile.belongsTo(FileEntity, {
    foreignKey: 'file_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  Profile.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UsersToFriends.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  UsersToFriends.belongsTo(User, {
    foreignKey: 'friend_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  UsersToFriends.belongsTo(User, {
    foreignKey: 'initiator_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserProgress.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

module.exports = setupAssociations;