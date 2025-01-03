import express from 'express'
import passport from 'passport'
import notificationController from '../controllers/notificationController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer', 'service-technician', 'administrator']),
    notificationController.getNotifications
)

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer', 'service-technician', 'administrator']),
    notificationController.updateNotificationStatus
)

export default router
