import express from 'express'
import passport from 'passport'
import serviceController from '../controllers/serviceController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get('/', serviceController.getServices)

router.get('/:id/subservice', serviceController.getSubserviceById)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.createService
)

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.updateService
)

router.patch(
    '/:id/add-subservices',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.addSubservices
)

router.patch(
    '/:id/edit-subservice',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.editSubservice
)

router.patch(
    '/:id/remove-subservice',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.removeSubservice
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    serviceController.deleteService
)

export default router
