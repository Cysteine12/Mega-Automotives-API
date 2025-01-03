import express from 'express'
import passport from 'passport'
import bookingController from '../controllers/bookingController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/:category',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookings
)

router.get(
    '/:category/status/:status',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookingsByStatus
)

router.get(
    '/:category/search',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.searchBookingsByOwner
)

router.get(
    '/:category/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookingById
)

router.patch(
    '/:id/status',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.updateBookingStatus
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    bookingController.deleteBooking
)

export default router
