const NotificationType = require('../models/notificationTypeModel');
const createNotificationType = async (req, res) => {
    try {
        const existsNotificationName = await NotificationType.findOne({
            where: { notification_name: req.body.notification_name },
        });
        if (existsNotificationName) {
            throw new Error(`NotificationType ${req.body.notification_name} already exists.`);
        }
        const notificationType = await NotificationType.create(req.body);
        return notificationType;
    } catch (error) {
        res.status(500).json({
            error: 'Error creating notification Type: ' + error.message,
        });
    }
}
const findAllNotificationTypes = async () => {
    const notificationTypes = await NotificationType.findAll();
    return notificationTypes;
  };

const patchNotificationType=async(id,content)=>{
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
          throw new Error(`NotificationType with ID ${id} not found.`);
        }
        await notificationType.update(content);
        return notificationType;
    } catch (error) {
        res.status(500).json({
            error: 'Error creating updating notification Type: ' + error.message,
        });
    }
}
const getById=async(id)=>{
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
          throw new Error(`NotificationType with ID ${id} not found.`);
        }
        return notificationType;
    } catch (error) {
        res.status(500).json({
            error: 'Error getting notification Type: ' + error.message,
        });
    }
}
const deleteNotificationType = async (req, res) => {
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
          throw new Error(`NotificationType with ID ${id} not found.`);
        }
        await notificationType.destroy();
        return { message: 'NotificationType deleted successfully.' };
    } catch (error) {
        res.status(500).json({
            error: 'Error deleting notification Type: ' + error.message,
        });
    }
}
module.exports = {
    createNotificationType,
    patchNotificationType,
    findAllNotificationTypes,
    deleteNotificationType,
    getById,
};
