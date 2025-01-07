import express from 'express'
import passport from 'passport'
import authController from '../controllers/authController.js'
import { verifyGoogleAccessToken } from '../config/google-auth-library.js'
// import authValidation from '../validations/authValidation.js'

const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/google', verifyGoogleAccessToken, authController.googleLogin)

router.post('/forgot-password', authController.forgotPassword)

router.post('/reset-password/:token', authController.resetPassword)

router.post('/refresh-token', authController.refreshToken)

router.get('/verify-email/:token', authController.verifyEmail)

router.post(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    authController.changePassword
)

router.post('/logout', authController.logout)

export default router
