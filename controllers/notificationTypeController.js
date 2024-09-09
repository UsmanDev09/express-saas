const notificationTypeService = require('../services/notificationTypeService');
const addNotificationType = async(req,res)=>{
    try {
        const notificationType = await notificationTypeService.createNotificationType(req);
        return res.status(201).json(notificationType);
      } catch (error) {
        console.error('Error creating notification type:', error);
        if (error.message.includes('already exists')) {
          return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
}
const getAllNotificationTypes = async (req, res) => {
    try {
      const notificationTypes = await notificationTypeService.findAllNotificationTypes();
      return res.status(200).json(notificationTypes);
    } catch (error) {
      console.error('Error fetching notification types:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
const updateNotificationTypes=async(req,res)=>{
    try {
        const { id } = req.params;
        const updatedNotificationType = await notificationTypeService.patchNotificationType(id, req.body);
        return res.status(200).json(updatedNotificationType);
      } catch (error) {
        console.error('Error updating notification type:', error);
        if (error.message.includes('not found')) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
}

const getNotificationTypesById=async(req,res)=>{
    try {
        const { id } = req.params;
        const NotificationType = await notificationTypeService.getById(id);
        return res.status(200).json(NotificationType);
      } catch (error) {
        console.error('Error getting notification type:', error);
        if (error.message.includes('not found')) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
}

const deleteNotificationTypes = async(req,res)=>{
    try {
        const { id } = req.params;
        const deletedNotificationType = await notificationTypeService.deleteNotificationType(id);
        return res.status(200).json({message:'Notification type deleted successfully',deletedNotificationType});
      } catch (error) {
        console.error('Error deleting notification type:', error);
        if (error.message.includes('not found')) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
}
module.exports= {
    addNotificationType,
    getAllNotificationTypes,
    deleteNotificationTypes,
    updateNotificationTypes,
    getNotificationTypesById,
}
