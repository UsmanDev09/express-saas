const leaderboardService = require('../services/leaderboardService');
const getAllLeaderboards = async (req, res) => {
    try {
      const userId = req.user.sub;
      const daily = await leaderboardService.getLeaderboardList(userId, 1);
      const weekly = await leaderboardService.getLeaderboardList(userId, 7);
      const monthly = await leaderboardService.getLeaderboardList(userId, 30);
  
      res.json({ daily, weekly, monthly });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve leaderboards' });
    }
  };
  
  module.exports = {
    getAllLeaderboards,
  };
