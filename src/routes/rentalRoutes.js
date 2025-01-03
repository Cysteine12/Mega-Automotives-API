import express from 'express'
import passport from 'passport'
import rentalController from '../controllers/rentalController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get('/', rentalController.getRentals)

router.get('/search', rentalController.searchRentalsByLicenseNo)

router.get('/:id', rentalController.getRentalById)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    rentalController.createRental
)

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    rentalController.updateRental
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    rentalController.deleteRental
)

export default router
