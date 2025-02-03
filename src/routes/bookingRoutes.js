import express from 'express'
import passport from 'passport'
import bookingController from '../controllers/bookingController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookings
)

router.get(
    '/status/:status',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookingsByStatus
)

router.get(
    '/owner/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.getBookingsByOwner
)

router.get(
    '/search',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    bookingController.searchBookingsByOwner
)

router.get(
    '/:id',
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
