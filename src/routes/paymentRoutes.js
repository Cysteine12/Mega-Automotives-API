import express from 'express'
import passport from 'passport'
import paymentController from '../controllers/paymentController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    paymentController.getPayments
)

router.post(
    '/initialize-payment',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    paymentController.initializePayment
)

router.get(
    '/verify-payment/:reference',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    paymentController.verifyPayment
)

export default router
