const notificationService = require('../services/notificationService');
const addNotification = async (req, res) => {
    try {
        const notification = await notificationService.addNotification(req);
        return notification;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const deleteNotification = async (req, res) => {
    try {
        const notification = await notificationService.deleteNotification(req);
        return notification;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
const notificationList = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.sub;
        const notifications = await notificationService.getNotifications(userId, parseInt(page), parseInt(limit));
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const notificationGameRequest = async (req, res) => {
    try {
        const notification = await notificationService.notificationGameRequest(req.body);
        return notification;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const notificationSystem = async (req, res) => {
    try {
        const systemNotification = await notificationService.notificationSystem(req.body);
        return systemNotification;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = {
    addNotification,
    deleteNotification,
    notificationList,
    notificationGameRequest,
    notificationSystem,
}
