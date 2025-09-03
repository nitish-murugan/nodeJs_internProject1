const Joi = require('joi');

const addSchoolValidation = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'School name is required',
            'string.min': 'School name must be at least 2 characters long',
            'string.max': 'School name must not exceed 255 characters',
            'any.required': 'School name is required'
        }),

    address: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.empty': 'Address is required',
            'string.min': 'Address must be at least 5 characters long',
            'string.max': 'Address must not exceed 500 characters',
            'any.required': 'Address is required'
        }),

    latitude: Joi.number()
        .min(-90)
        .max(90)
        .required()
        .messages({
            'number.base': 'Latitude must be a valid number',
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90',
            'any.required': 'Latitude is required'
        }),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
        .messages({
            'number.base': 'Longitude must be a valid number',
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180',
            'any.required': 'Longitude is required'
        })
});

const listSchoolsValidation = Joi.object({
    latitude: Joi.number()
        .min(-90)
        .max(90)
        .required()
        .messages({
            'number.base': 'User latitude must be a valid number',
            'number.min': 'User latitude must be between -90 and 90',
            'number.max': 'User latitude must be between -90 and 90',
            'any.required': 'User latitude is required'
        }),

    longitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
        .messages({
            'number.base': 'User longitude must be a valid number',
            'number.min': 'User longitude must be between -180 and 180',
            'number.max': 'User longitude must be between -180 and 180',
            'any.required': 'User longitude is required'
        })
});

module.exports = {
    addSchoolValidation,
    listSchoolsValidation
};
