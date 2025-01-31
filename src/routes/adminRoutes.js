import express from 'express'
import passport from 'passport'
import adminController from '../controllers/adminController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/dashboard',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.dashboard
)

router.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.getUsers
)

router.get(
    '/users/role/:role',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.getUsersByRole
)

router.get(
    '/users/search',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.searchUsersByName
)

router.get(
    '/users/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.getUserById
)

router.post(
    '/users',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.createUser
)

router.patch(
    '/users/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.updateUser
)

router.patch(
    '/users/:id/role',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.updateUserRole
)

router.delete(
    '/users/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.deleteUser
)

router.get(
    '/payments',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.getPayments
)

router.get(
    '/payments/user/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    adminController.getPaymentsByUser
)

export default router
