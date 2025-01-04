import express from 'express'
import passport from 'passport'
import userController from '../controllers/userController.js'

const router = express.Router()

router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.getProfile
)

router.patch(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.updateProfile
)

router.patch(
    '/profile/photo',
    passport.authenticate('jwt', { session: false }),
    userController.updateProfilePhoto
)

router.post(
    '/generate-signature',
    passport.authenticate('jwt', { session: false }),
    userController.generateSignature
)

router.delete(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.deleteProfile
)

export default router
