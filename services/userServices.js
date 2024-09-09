const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const findUserByEmailAndPassword = async (userEmail, password) => {
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error.message}`);
  }
};

const findByEmail=async(userEmail)=>{
    try {
        const userProfile = await User.findOne({ where: { email: userEmail } });
        if (!userProfile) {
          throw new Error('User profile not found');
        }
        return userProfile;
      } catch (error) {
        throw new Error('Error retrieving user profile: ' + error.message);
      }
}
const findByUsername=async(username)=>{
  try {
    const userProfile = await User.findOne({ where: { username } });
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    console.log("User profile in password",userProfile);
    return userProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}
const findByUserId=async(userId)=>{
  try {
    const userProfile = await User.findOne({ where: { id:userId } });
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    return userProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
    findByEmail,
    findByUsername,
    findByUserId,
    findUserByEmailAndPassword,
};
