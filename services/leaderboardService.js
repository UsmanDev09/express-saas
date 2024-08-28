const { Op } = require('sequelize');
const User = require('../models/userModel');
const UserLeaderboards = require('../models/leaderboardModel');

const getLeaderboardList = async (userId, days) => {
  const dateRange = calculateTimeAgo(days);
  const users = await UserLeaderboards.findAll({
    where: {
      created_at: {
        [Op.between]: [dateRange.startDate, dateRange.endDate],
      },
    },
  });
  return getLeaderboard(userId, users);
};

const getLeaderboard = async (ownUserId, users) => {
  const userDetails = await getUsersDetails(ownUserId);

  const totalExpMap = getTotalExpForEachUser(users);
  const sortedExpArray = Array.from(totalExpMap.entries()).sort((a, b) => b[1] - a[1]);

  const rankedUsers = await Promise.all(
    sortedExpArray.map(async ([userId], index) => {
      const user = userDetails.find((user) => user.user_id === userId);
      if (!user) return null;

      const friendships = determineFriendshipStatus(user, ownUserId);
      return createUserObject(user, friendships, index + 1);
    })
  );

  return rankedUsers.filter((user) => user !== null);
};

const getUsersDetails = async (userId) => {
  return await User.findAll({
    where: { id: userId },
    include: [{ model: UserLeaderboards, as: 'leaderboards' }],
  });
};

const getTotalExpForEachUser = (users) => {
  return users.reduce((expMap, user) => {
    const exp = expMap.get(user.userId) || 0;
    expMap.set(user.userId, exp + user.exp);
    return expMap;
  }, new Map());
};

const determineFriendshipStatus=(usersDetails, ownUserId, userId, user)=>{
    const isUserFriend = usersDetails.find(user => user.user_id === userId && user.friend_id === ownUserId);

    if (isUserFriend) {
        return isUserFriend.friend_confirmed ? 'Friend' : 'Pending';
    } else if (user && user.user_id === ownUserId) {
        return 'Self';
    }
    return 'None';
}

const createUserObject = (user, friendships, rank) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    level: user.level,
    friendships,
    rank,
    imageUrl: user.profileImagePath,
  };
};

const calculateTimeAgo = (days) => {
  const currentTime = new Date();
  return {
    startDate: new Date(currentTime.getTime() - days * 24 * 60 * 60 * 1000),
    endDate: currentTime,
  };
};

module.exports = {
  getLeaderboardList,
  create: async (exp, userId) => {
    return await UserLeaderboards.create({ exp, userId });
  },
};
