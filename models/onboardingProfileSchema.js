const Joi = require('joi');
const onboardingProfileSchema = Joi.object({
  firstStep: Joi.object({
    name: Joi.string().optional(),
    age: Joi.number().optional(),
    gender: Joi.string().optional(),
  }).optional(),
  secondStep: Joi.object({
    profileType: Joi.string().optional(),
  }).optional(),
  thirdStep: Joi.object({
    learningPace: Joi.string().optional(),
  }).optional(),
  fourthStep: Joi.object({
    softSkills: Joi.array().items(Joi.string().uuid()).optional(),
  }).optional(),
});

module.exports = { onboardingProfileSchema };
