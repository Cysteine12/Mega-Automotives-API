import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
    generateAccessToken,
    generateRefreshToken,
} from '../utils/generateTokens.js'
import {
    accessTokenCookieConfig,
    refreshTokenCookieConfig,
} from '../config/config.js'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import {
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError,
    ValidationError,
} from '../middlewares/errorHandler.js'

const register = async (req, res, next) => {
    try {
        const newUser = {
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName,
            },
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
        }

        let user = await User.findOne({ email: newUser.email })
        if (user) {
            throw new ValidationError('This email already exists')
        }

        const verificationToken = uuidv4()

        user = new User({
            ...newUser,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
        })
        const savedUser = await user.save()

        const verifyUrl = `${req.protocol}://${req.get(
            'host'
        )}/api/auth/verify-email/${verificationToken}`

        await emailService.sendWelcomeMail(savedUser, verifyUrl)

        res.status(201).json({
            success: true,
            message:
                'Registration successful. Please check your email to verify your account.',
        })
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        let user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError('This email is not registered')
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new ValidationError('Incorrect password')
        }

        if (!user.isVerified) {
            const verificationToken = uuidv4()

            user.emailVerificationToken = verificationToken
            user.emailVerificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000
            await user.save()

            const verifyUrl = `${req.protocol}://${req.get(
                'host'
            )}/api/auth/verify-email/${verificationToken}`

            await emailService.sendWelcomeMail(user, verifyUrl)
        }

        user = {
            _id: user._id,
            name: {
                firstName: user.name.firstName,
                lastName: user.name.lastName,
            },
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        }

        const payload = { _id: user._id }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie('accessToken', accessToken, accessTokenCookieConfig)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieConfig)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
        })
    } catch (err) {
        next(err)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError('User with this email does not exist')
        }
        const resetToken = uuidv4()
        const salt = await bcrypt.genSalt(10)
        const hashedToken = await bcrypt.hash(resetToken, salt)

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
        await user.save()

        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/reset-password/${resetToken}?email=${email}`

        await emailService.sendForgotPasswordMail(email, resetUrl)

        res.status(200).json({
            success: true,
            message: 'Email sent. Please check your inbox.',
        })
    } catch (err) {
        next(err)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params
        const { email, password } = req.body

        const user = await User.findOne({
            email,
            resetPasswordExpire: { $gt: Date.now() },
        })
        if (!user) {
            throw new ValidationError('Expired token. Try again')
        }

        const isMatch = await bcrypt.compare(token, user.resetPasswordToken)
        if (!isMatch) {
            throw new ValidationError('Invalid token. Try again')
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully',
        })
    } catch (err) {
        next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            throw new UnauthenticatedError('No refresh token')
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err)
                    throw new UnauthenticatedError('Invalid or expired token')

                const payload = { _id: user._id }

                const accessToken = generateAccessToken(payload)
                const newRefreshToken = generateRefreshToken(payload)

                res.cookie('accessToken', accessToken, accessTokenCookieConfig)
                res.cookie(
                    'refreshToken',
                    newRefreshToken,
                    refreshTokenCookieConfig
                )

                res.status(200).json({
                    success: true,
                    message: 'Tokens refreshed successfully',
                })
            }
        )
    } catch (err) {
        next(err)
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpire: { $gt: Date.now() },
        })
        if (!user) {
            throw new ValidationError('Invalid or expired token. Try again')
        }

        user.isVerified = true
        user.emailVerificationToken = undefined
        user.emailVerificationTokenExpire = undefined

        await user.save()

        await notificationService.userEmailVerified(user)

        await emailService.sendEmailVerificationMail(user)

        res.status(200).json({
            success: true,
            message: 'Email verification successful',
        })
    } catch (err) {
        next(err)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body
        const { _id } = req.user

        const user = await User.findOne({ _id })
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            throw new ValidationError('Incorrect password')
        }

        user.password = newPassword
        await user.save()

        await notificationService.userPasswordChanged(user)

        res.status(200).json({
            success: true,
            message: 'Password has been changed successfully',
        })
    } catch (err) {
        next(err)
    }
}

const logout = (req, res, next) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    })
}

export default {
    register,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyEmail,
    changePassword,
    logout,
}
