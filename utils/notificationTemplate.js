const NotificationTemplates = {
    Welcome: (data) =>
      `Welcome! We're thrilled to have you here. Dive in, explore, and enjoy your journey with us.\n If you need anything, we're here to help! \n -The Shaper Team`,
  
    FriendRequest: (data) => `${data.name} wants to be your friend`,
  
    FriendRequestAccepted: (data) => `Friend request accepted by ${data.name}`,
  
    GameRequest: (data) => `${data.name} wants to play with you`,
  
    AchievementUnlocked: (data) => `A ${data.name} achievement has been unlocked for you.`,
  };
  module.exports = NotificationTemplates;
  