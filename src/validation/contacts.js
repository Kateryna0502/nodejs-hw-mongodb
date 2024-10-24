
import Joi from 'joi';
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
      'string.base': 'Name must be a string',
      'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().messages({
    'string.base': 'Invalid email',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
      'string.base': 'Name must be a string',
      'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().messages({
    'string.base': 'Invalid email',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});




export const studentSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    'string.base': 'Student name must be a string',
    'any.required': 'Student name is required',
  }),
  age: Joi.number().required(),
  gender: Joi.string().valid('male', 'female').required(),
  onDuty: Joi.boolean(),
});
