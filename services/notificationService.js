const Notification = require('../models/notificationsModel');
const UsersToFriends = require('../models/userFriendsModel');
const NotificationType = require('../models/notificationTypeModel');
const UserNotificationGroup=require('../models/userNotificationGroupModel');
const Profile = require('../models/profilesModel');
const FileEntity = require('../models/file.entity.model');
const User = require('../models/userModel');
const NotificationTypeEnum = require('../enums/notification-type.enum');
const FirebaseActionType = require('../enums/firebase-action.enum');
const UserStatus = require('../enums/user-status');
const firebaseService = require('./firebaseService');
const { Op } = require('sequelize');
const addNotification = async(req,res)=>{
    try {
        const notificationRequest = req.body;
        if (!notificationRequest.user_id || !notificationRequest.notification_message) {
          return res.status(400).json({ error: 'Required fields are missing' });
        }
        const newNotification = await Notification.create(notificationRequest);
        res.status(201).json({
          message: 'Notification created successfully',
          notification: newNotification,
        });
      } catch (error) {
        res.status(500).json({
          error: 'Error creating notification: ' + error.message,
        });
      }
}
const deleteNotification=async(req,res)=>{
    const userId = req.user.sub; 
    const notificationId = req.params.id;

  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_action: {
          [Op.ne]: 'deleted',
        },
        user_id: userId,
      },
    });

    if (notification) {
      if (
        notification.notification_type_id === 'ac828629-4c4f-4112-bbad-665c57d0cd38' &&
        notification.user_request_action === 'no-action'
      ) {
        const friendships = await UsersToFriends.findAll({
          where: {
            [Op.or]: [
              { user_id: userId, confirmed: false },
              { friend_id: userId, user_id: notification.from_user_id, confirmed: false },
            ],
          },
        });

        if (friendships.length) {
          // Start a transaction for removing friendships
          await UsersToFriends.sequelize.transaction(async (transaction) => {
            await UsersToFriends.destroy({
              where: {
                user_id: friendships.map((f) => f.user_id),
              },
              transaction,
            });
          });
        }
      }

      // Update the notification
      notification.user_action = 'deleted';
      notification.updated_at = new Date();
      await notification.save();

      return res.json({ message: "Notification deleted successfully" });
    } else {
      return res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const getNotifications = async (userId, page = 1, limit = 10) => {
  const unreadCount = await Notification.count({
    where: {
      user_action: 'unread',
      user_id: userId,
    },
  });

  return {
    todays: await getTodayNotifications(userId),
    others: await getOldNotifications(userId, page, limit),
    unreadCount: unreadCount,
  };
};

const getTodayNotifications = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const notifications = await Notification.findAll({
    attributes: [
      'id', 'notification_type_id', 'group_id', 'user_id', 'created_at',
      'from_user_id', 'notification_message', 'notification_link', 'user_action',
      'user_request_action', 'expiry_date', 'status'
    ],
    include: [
      {
        model: NotificationType,
        attributes: ['notification_name', 'id', 'is_system_generated'],
      },
      {
        model: UserNotificationGroup,
        attributes: ['name', 'description', 'condition'],
      },
      {
        model: Profile,
        as: 'fromUser',
        include: [
          {
            model: FileEntity,
            attributes: ['path'],
          },
        ],
      },
    ],
    where: {
      user_id: userId,
      user_action: { [Op.ne]: 'deleted' },
      created_at: {
        [Op.gte]: startOfDay,
        [Op.lt]: endOfDay,
      },
    },
    order: [['created_at', 'DESC']],
  });

  return {
    total: notifications.length,
    data: notifications,
  };
};

const getOldNotifications = async (userId, page, limit) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const { count: total, rows: notifications } = await Notification.findAndCountAll({
    attributes: [
      'id', 'notification_type_id', 'group_id', 'user_id', 'created_at',
      'from_user_id', 'notification_message', 'notification_link', 'user_action',
      'user_request_action', 'expiry_date', 'status'
    ],
    include: [
      {
        model: NotificationType,
        attributes: ['notification_name', 'id', 'is_system_generated'],
      },
      {
        model: UserNotificationGroup,
        attributes: ['name', 'description', 'condition'],
      },
      {
        model: Profile,
        as: 'fromUser',
        include: [
          {
            model: FileEntity,
            attributes: ['path'],
          },
        ],
      },
    ],
    where: {
      user_id: userId,
      user_action: { [Op.ne]: 'deleted' },
      created_at: { [Op.lte]: startOfDay },
    },
    order: [['created_at', 'DESC']],
    limit: limit,
    offset: (page - 1) * limit,
  });

  return {
    data: notifications,
    total: total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};
const notificationGameRequest = async(notificationRequest)=>{
  const friend = await User.findOne({
    where: {
      id: notificationRequest.from_user_id,
      status: UserStatus.Active,
    },
  });
  if (friend) {
    await notification({
      notification_type_id: NotificationTypeEnum.GameRequest,
      user_id: notificationRequest.user_id,
      from_user_id: notificationRequest.from_user_id,
      notification_message: `Game request from ${friend.username}`,
    });
  }

  return { message: "Game notification sent successfully" };
}

async function notification(notificationRequest) {
  const userId = notificationRequest.user_id;
  const data = await Notification.create(notificationRequest);
  const resultCount = await notificationCount(userId);
  await firebaseService.updateNotification(userId, {
    status: FirebaseActionType.New,
    notificationCount:
      resultCount.friendRequests +
      resultCount.gameRequest +
      resultCount.serviceRequest +
      resultCount.achievementUnlocked,
    notifications: resultCount,
  });

  return data;
}

async function notificationCount(userId) {
  const friendRequests = await Notification.count({
    where: { user_id: userId, notification_type_id: NotificationTypeEnum.FriendRequest },
  });
  const gameRequest = await Notification.count({
    where: { user_id: userId, notification_type_id: NotificationTypeEnum.GameRequest },
  });
  const serviceRequest = await Notification.count({
    where: { user_id: userId },
  });
  const achievementUnlocked = await Notification.count({
    where: { user_id: userId, notification_type_id: NotificationTypeEnum.AchievementUnlocked },
  });

  return {
    friendRequests,
    gameRequest,
    serviceRequest,
    achievementUnlocked,
  };
}
const notificationSystem=async(notificationRequest)=>{
  try {
    await notification({
      notification_type_id:notificationRequest.notification_type_id,
      user_id: notificationRequest.user_id,
      notification_message: notification.notification_message,
    })
    return {message:"System notification generated"};
  } catch (error) {
    res.status(500).json({
      error: 'Error creating system notification: ' + error.message,
    });
  }
}
const updateUserActionByNId = async (data, nId) => {
  try {
    const notification = await Notification.findOne({ where: { id: nId } });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.user_request_action = data.user_request_action;
    notification.updated_at = new Date();
    await notification.save();
    return { message: 'Notification updated successfully' };
  } catch (error) {
    throw new Error('Error updating notification: ' + error.message);
  }
};
module.exports = {
    addNotification,
    deleteNotification,
    getNotifications,
    notificationGameRequest,
    notificationSystem,
    notification,
    updateUserActionByNId,
};
