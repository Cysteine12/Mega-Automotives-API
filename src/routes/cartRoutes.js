import express from 'express'
import passport from 'passport'
import cartController from '../controllers/cartController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    cartController.viewCart
)

router.post(
    '/add',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    cartController.addItem
)

router.patch(
    '/edit/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    cartController.editItem
)

router.patch(
    '/remove/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    cartController.removeItem
)

router.delete(
    '/clear',
    passport.authenticate('jwt', { session: false }),
    authorize(['customer']),
    cartController.clearCart
)

export default router
