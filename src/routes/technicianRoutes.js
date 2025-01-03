import express from 'express'
import passport from 'passport'
import technicianController from '../controllers/technicianController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    authorize(['service-technician']),
    technicianController.getUsers
)

router.get(
    '/users/search',
    passport.authenticate('jwt', { session: false }),
    authorize(['service-technician']),
    technicianController.searchUsersByName
)

router.get(
    '/users/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['service-technician']),
    technicianController.getUserById
)

export default router
