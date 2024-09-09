class OnboardingRequest {
    constructor(data) {
      this.firstStep = data.firstStep;
      this.secondStep = data.secondStep;
      this.thirdStep = data.thirdStep;
      this.fourthStep = data.fourthStep;
    }
  
    getData(userId, usersToSkills) {
      const { name = null, ...rest } = this.firstStep || {};
  
      const user = name ? { name, usersToSkills } : { usersToSkills };
  
      return {
        ...user,
        profile: {
          ...rest,
          ...(this.secondStep || {}),
          ...(this.thirdStep || {}),
          user: {
            id: userId,
          },
        },
      };
    }
  }
  
  module.exports = { OnboardingRequest };
  