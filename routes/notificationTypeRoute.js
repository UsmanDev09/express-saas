const express = require('express');
const router = express.Router();
const notificationTypeController = require('../controllers/notificationTypeController');

router.post('/',notificationTypeController.addNotificationType);
router.get('/',notificationTypeController.getAllNotificationTypes);
router.get('/:id',notificationTypeController.getNotificationTypesById);
router.patch('/:id',notificationTypeController.updateNotificationTypes);
router.delete('/:id',notificationTypeController.deleteNotificationTypes);
module.exports = router;