const express = require('express');
const router = express.Router();

const auth = require('../middlewares/index');
const profileController = require('../controllers/profileController');

// Auth Routes
router.patch('/', auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.updateProfile);
router.patch('/password', auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.changePassword);
router.patch('/user-progress/:id',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.updateUserProgress);
router.get('/user-progress/:id',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.getUserProgress);
router.get('/friends',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.getFriends);
router.get('/friends/get-all-without-pagination',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.getFriends);
router.post('/friends/request/:friendid',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.sendFriendRequest);
router.patch('/friends/request/accept/:friendid/:notificationid',auth.isAuthenticated('Active', 'Pending', 'Verified'), profileController.acceptFriendRequest);
router.put('/onboarding',auth.isAuthenticated('Active', 'Pending', 'Verified'),profileController.profileOnboarding);
router.get('/onboarding',auth.isAuthenticated('Active', 'Pending', 'Verified'),profileController.getOnboarding);

module.exports = router;
