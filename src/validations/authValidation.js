// src/validations/userValidation.js
import { body, param } from 'express-validator'

const validateName = (fieldName) => {
    return body(fieldName)
        .isString()
        .withMessage(`${fieldName} must be a string`)
        .notEmpty()
        .withMessage(`${fieldName} is required`)
}

const validateEmail = () => {
    return body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .notEmpty()
        .withMessage('Email is required')
}

const validatePassword = (fieldName) => {
    return body(fieldName)
        .isLength({ min: 7 })
        .withMessage(`${fieldName} must be at least 7 characters long`)
        .notEmpty()
        .withMessage(`${fieldName} is required`)
}

const validatePhone = () => {
    return body('phone')
        .isNumeric()
        .withMessage('Phone number must be a valid number')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be exactly 10 digits')
        .notEmpty()
        .withMessage('Phone number is required')
}

const validateRole = () => {
    return body('role')
        .optional()
        .isIn([
            'customer',
            'administrator',
            'service-technician',
            'insurance-company',
        ])
        .withMessage('Invalid role')
}

const validateToken = () => {
    return param('token')
        .isUUID()
        .withMessage(`Invalid token`)
        .notEmpty()
        .withMessage(`Token is required`)
}

const registerValidation = [
    validateName('name.firstName'),
    validateName('name.lastName'),
    validateEmail(),
    validatePassword('password'),
    validatePhone(),
]

const loginValidation = [validateEmail(), validatePassword('password')]

const forgotPasswordValidation = [validateEmail()]

const resetPasswordValidation = [validateToken(), validatePassword('password')]

const verifyEmailValidation = [validateToken()]

const changePasswordValidation = [
    validatePassword('currentPassword'),
    validatePassword('newPassword'),
]

module.exports = {
    registerValidation,
    loginValidation,
}
