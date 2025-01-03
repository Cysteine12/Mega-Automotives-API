import express from 'express'
import passport from 'passport'
import UserController from '../controllers/userController.js'
import roleMiddleware from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    roleMiddleware(['administrator']),
    AdminController.getUserById
)

export default router
