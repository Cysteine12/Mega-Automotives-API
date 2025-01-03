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
    '/upload-photo',
    passport.authenticate('jwt', { session: false }),
    userController.uploadPhoto
)

router.delete(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    userController.deleteProfile
)

export default router
