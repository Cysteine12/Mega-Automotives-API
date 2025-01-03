import express from 'express'
import passport from 'passport'
import customerController from '../controllers/customerController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/vehicles',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.getVehicles
)

router.get(
    '/vehicles/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.getVehicleById
)

router.post(
    '/vehicles',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.createVehicle
)

router.patch(
    '/vehicles/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.updateVehicle
)

router.delete(
    '/vehicles/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.deleteVehicle
)

router.get(
    '/bookings',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.getBookings
)

router.get(
    '/bookings/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.getBooking
)

router.post(
    '/bookings',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.createBooking
)

router.patch(
    '/bookings/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.updateBooking
)

router.delete(
    '/bookings/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    customerController.deleteBooking
)

export default router
