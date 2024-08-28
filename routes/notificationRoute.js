const express = require('express');
const router = express.Router();

const auth = require('../middlewares/index');
const notificationController = require('../controllers/notificationController');

router.post('/',notificationController.addNotification);
router.post('/game-request-notification',notificationController.notificationGameRequest);
router.post('/system-notification',notificationController.notificationSystem);
router.get('/',auth.isAuthenticated('Active', 'Pending', 'Verified'),notificationController.notificationList);
router.delete('/:id',auth.isAuthenticated('Active', 'Pending', 'Verified'),notificationController.deleteNotification);

module.exports = router;
