const express = require('express');
const router = express.Router();

const auth = require('../middlewares/index');
const profileController = require('../controllers/profileController');

router.patch('/', auth.isAuthenticated(['active', 'pending', 'verified']), profileController.updateProfile);
router.patch('/password', auth.isAuthenticated(['active', 'pending', 'verified']), profileController.changePassword);
router.patch('/user-progress/:id',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.updateUserProgress);
router.get('/user-progress/:id',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.getUserProgress);
router.get('/friends',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.getFriends);
router.get('/friends/get-all-without-pagination',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.getFriends);
router.post('/friends/request/:friendid',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.sendFriendRequest);
router.patch('/friends/request/accept/:friendid/:notificationid',auth.isAuthenticated(['active', 'pending', 'verified']), profileController.acceptFriendRequest);
router.put('/onboarding',auth.isAuthenticated(['active', 'pending', 'verified']),profileController.profileOnboarding);
router.get('/onboarding',auth.isAuthenticated(['active', 'pending', 'verified']),profileController.getOnboarding);

module.exports = router;
