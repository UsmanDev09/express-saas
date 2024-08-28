const express = require('express');
const router = express.Router();

const auth = require('../middlewares/index');
const leaderboardController = require('../controllers/leaderboardController');
router.get('/list',auth.isAuthenticated('Active', 'Pending', 'Verified'),leaderboardController.getAllLeaderboards);

module.exports = router;
