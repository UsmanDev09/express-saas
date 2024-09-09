const profileService = require('../services/profileService');
const updateProfile = async(req,res)=>{
    try {
        const profile=await profileService.updateProfile(req.user,req.body);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const changePassword = async(req,res)=>{
    try {
        const profile=await profileService.changePassword(req.user,req.body);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getUserProgress=async(req,res)=>{
    try {
        const profile=await profileService.getUserProgress(req.params.id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateUserProgress=async(req,res)=>{
    try {
        const profile=await profileService.updateUserProgress(req.params.id,req.body);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
//Profile onboarding section

const profileOnboarding = async(req,res)=>{
    try {
        const onboarding=await profileService.profileOnboarding(req,res);
        res.status(200).json(onboarding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getOnboarding = async (req, res) => {
    try {
        const user = await profileService.getOnboarding(req.user.sub);
        return res.json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


// Profile Friends section
const getFriends=async(req,res)=>{
    try {
        const friends=await profileService.getFriends(req.user.sub);
        res.status(200).json(friends);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const sendFriendRequest=async(req,res)=>{
    try {
        const friends=await profileService.sendFriendRequest(req.params.friendid,req.user.sub);
        res.status(200).json(friends);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const acceptFriendRequest = async (req, res) => {
    const friendId = req.params.friendid;
    const notificationId = req.params.notificationid;
    const userId = req.user.sub;
    try {
        const result = await profileService.acceptRequest(userId, friendId, notificationId);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
module.exports= {
    updateProfile,
    changePassword,
    getUserProgress,
    updateUserProgress,
    getFriends,
    sendFriendRequest,
    profileOnboarding,
    getOnboarding,
    acceptFriendRequest,
}
