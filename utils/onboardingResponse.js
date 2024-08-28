class OnboardingResponse {
    constructor(user) {
      this.firstStep = new OnboardingFirstStepResponse(user);
      this.secondStep = new OnboardingSecondStepResponse(user.profile);
      this.thirdStep = new OnboardingThirdStepResponse(user.profile);
      // Uncomment if you have the fourth step implemented
      // this.fourthStep = new OnboardingFourthStepResponse(user);
    }
  
    get complete() {
      return Object.values(this).reduce((acc, item) => acc && item.complete, true);
    }
  
    get currentStep() {
      const index = Object.values(this).findIndex((item) => !item.complete);
      const keys = Object.keys(this);
      return index === -1 ? keys[keys.length - 1] : keys[index];
    }
  }
  
  class OnboardingFirstStepResponse {
    constructor(user) {
      this.name = user.name;
      this.age = user?.profile?.age || null;
      this.gender = user?.profile?.gender || null;
    }
  
    get complete() {
      return [this.name, this.age, this.gender].every(item => item !== null && item !== '');
    }
  }
  
  class OnboardingSecondStepResponse {
    constructor(profile) {
      this.profileType = profile?.profileType || null;
    }
  
    get complete() {
      return !!this.profileType;
    }
  }
  
  class OnboardingThirdStepResponse {
    constructor(profile) {
      this.learningPace = profile?.learningPace || null;
    }
  
    get complete() {
      return !!this.learningPace;
    }
  }
  
  // Export the classes
  module.exports = {
    OnboardingResponse,
    OnboardingFirstStepResponse,
    OnboardingSecondStepResponse,
    OnboardingThirdStepResponse,
  };
  