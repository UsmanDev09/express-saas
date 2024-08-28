const profile = require('../models/profilesModel');
const userService = require('./userServices');
const bcrypt = require('bcryptjs');
const userProgress=require('../models/userProgressModel');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const { BadRequestException, NotFoundException } = require('../utils/errors');
const { onboardingProfileSchema } = require('../models/onboardingProfileSchema');
const { OnboardingRequest } = require('../utils/onboardingRequest');
const { OnboardingResponse } = require('../utils/onboardingResponse');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const UsersToFriends = require('../models/userFriendsModel');
const UserStatus = require('../enums/user-status');
const notificationService = require('./notificationService');
const UseRequstActionEnum = require('../enums/requestActionEnum');
const NotificationTypeEnum = require('../enums/notification-type.enum');
const NotificationTemplates = require('../utils/notificationTemplate');
const updateProfile = async (user, request) => {
  const transaction = await sequelize.transaction();
  try {
    const userProfile = await profile.findOne({ where: { user_id: user.sub }, transaction });
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    const userUpdateData = {};
    if (request.name) userUpdateData.name = request.name;
    if (request.username) userUpdateData.username = request.username;

    if (Object.keys(userUpdateData).length > 0) {
      await User.update(userUpdateData, { where: { id: user.sub }, transaction });
    }
    const updatedProfile = await userProfile.update(request, { transaction });
    await transaction.commit();
    return updatedProfile;
  } catch (error) {
    await transaction.rollback();
    throw new Error('Error updating user profile: ' + error.message);
  }
};
const changePassword = async(user,request)=>{
    try {
        const userProfile = await userService.findByUserId(user.sub);
        if (!userProfile) {
            throw new Error('User profile not found');
        }
        const hashedPassword = await bcrypt.hash(request.password, 10);
        const updatedProfile = await userProfile.update({ password: hashedPassword });

        return updatedProfile;
    } catch (error) {
        throw new Error('Error updating user profile: ' + error.message);
    }
}
const getProfile=async(userId)=>{
    try {
        const userProfile = await profile.findOne({ where: { user_id: userId } });
        if (!userProfile) {
            throw new Error('User profile not found');
        }
        return userProfile;
    } catch (error) {
        throw new Error('Error getting profile: ' + error.message);
    }
}
const getUserProgress=async(userId)=>{
    try {
        const userProfile = await userProgress.findOne({ where: { user_id: userId } });
        if (!userProfile) {
            throw new Error('User progress not found');
        }
        return userProfile;
    } catch (error) {
        throw new Error('Error getting profile: ' + error.message);
    }
}
const updateUserProgress = async (userId,updateData) => {
    try {
        const [affectedRows] = await userProgress.update(updateData, {
            where: { id:userId },
        });

        if (affectedRows === 0) {
            throw new Error('User progress not found or no changes applied');
        }
        const updatedUserProgress = await userProgress.findByPk(id);
        return updatedUserProgress;
    } catch (error) {
        throw new Error(error.message);
    }
}
const getFriends = async(userId)=>{
    try {
        const friendProfile = await UsersToFriends.findOne({ where: { user_id: userId } });
        if (!friendProfile) {
            throw new Error('User friends not found');
        }
        return friendProfile;
    } catch (error) {
        throw new Error(error.message);
    }
}
const sendFriendRequest = async(friend_id,user_id)=>{
    try {
        const friend = await User.findOne({
          where: {
            id: {
              [Op.and]: [
                { [Op.eq]: friend_id },
                { [Op.not]: user_id }
              ]
            },
            status: UserStatus.Active,
          }
        });
    
        if (!friend) {
          throw new Error('Friend not found or inactive');
        }
        

        const exists = await UsersToFriends.findOne({
          where: {
            user_id,
            friend_id,
          },
        });
    
        if (!exists) {
          // Use a transaction to ensure both records are created atomically
          await UsersToFriends.sequelize.transaction(async (t) => {
            await UsersToFriends.bulkCreate([
              { user_id, friend_id, initiator_id: user_id },
              { user_id: friend_id, friend_id: user_id, initiator_id: user_id },
            ], { transaction: t });
          });
    
        //   // Send a notification
        notificationService.notification({
            notification_type_id: NotificationTypeEnum.FriendRequest,
            user_id: friend_id,
            from_user_id: user_id,
            notification_message: NotificationTemplates.FriendRequest({ name: friend.name }),
          });
        }
        return { message: "Friend Request sent successfully" };
      } catch (error) {
        throw new Error('Error sending friend request: ' + error.message);
      }
}
const profileOnboarding=async(req,res)=>{
    const userId = req.user.sub;
    const onboardingRequest = new OnboardingRequest(req.body);

    try {
      const user = await User.findOne({
        where: { id: userId },
        include: ['usersToSkills'],
      });

      if (!user) throw new NotFoundException('User not found');

      if (user.status==='active' || !user.email_verified) {
        throw new BadRequestException(
          user.status==='active'
            ? 'Onboarding already completed'
            : 'Email not verified'
        );
      }

      const usersToSkills = await findSoftSkillsByIds(onboardingRequest?.fourthStep?.softSkills ?? []);
      const data = onboardingRequest.getData(user.id, usersToSkills);
      await user.update(data);

      const result = await User.findOne({
        where: { id: userId },
      });

      const response = new OnboardingResponse(result);

      if (response.complete) {
        await user.update({ status: 'active' });
      }

      return res.json(response);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
 async function findSoftSkillsByIds(ids) {
    if (ids.length) {
      return ids.map((id) => ({ softSkillId: id }));
    }
    return [];
  }
  async function getOnboarding(userId) {
    const user = await getOneWithSkills(userId);
    return new OnboardingResponse(user);
  }
  async function getOneWithSkills(id) {
    return await User.findOne({
      where: { id },
      include: ['usersToSkills', 'profile'],
    });
  }
const acceptRequest = async (userId, friendId, notificationId) => {
    try {
      const friendships = await UsersToFriends.findAll({
        where: {
          [Op.or]: [
            {
              user_id: userId,
              initiator_id: { [Op.and]: { [Op.eq]: userId, [Op.ne]: friendId } },
              confirmed: false,
            },
            {
              friend_id: userId,
              initiator_id: { [Op.and]: { [Op.eq]: userId, [Op.ne]: friendId } },
              confirmed: false,
            },
          ],
        },
      });
      const friend = await User.findOne({
        where: {
          id: { [Op.and]: { [Op.eq]: userId, [Op.ne]: friendId } },
          status: UserStatus.Active,
        },
      });
      console.log("Frienships: ",friendships);
      console.log("friend: ",friend);
      if (friendships.length > 0) {
        await UsersToFriends.sequelize.transaction(async (transaction) => {
          await Promise.all(
            friendships.map((item) =>
              item.update({ confirmed: true }, { transaction })
            )
          );
        });
        await notificationService.updateUserActionByNId(
          {
            user_request_action: UseRequstActionEnum.Accepted,
          },
          notificationId
        );

        await notificationService.notification({
          notification_type_id: NotificationTypeEnum.FriendRequestsAccepted,
          user_id: friendId,
          from_user_id: userId,
          notification_message: NotificationTemplates.FriendRequestAccepted({
            name: friend.name,
          }),
        });
  
        return { message: "Friend request accepted successfully" };
      } else {
        throw new Error('Friendship not found');
      }
    } catch (error) {
      throw new Error('Error accepting friend request: ' + error.message);
    }
  };

module.exports={
    updateProfile,
    changePassword,
    getProfile,
    getUserProgress,
    updateUserProgress,
    getFriends,
    sendFriendRequest,
    profileOnboarding,
    getOnboarding,
    acceptRequest,
}