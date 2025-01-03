import express from 'express'
import passport from 'passport'
import vehicleController from '../controllers/vehicleController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.getVehicles
)

router.get(
    '/category/:category',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.getVehiclesByCategory
)

router.get(
    '/owner/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.getVehiclesByOwnerId
)

router.get(
    '/search',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.searchVehiclesByLicenseNo
)

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.getVehicleById
)

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    vehicleController.updateVehicle
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    vehicleController.deleteVehicle
)

export default router
