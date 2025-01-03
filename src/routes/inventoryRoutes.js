import express from 'express'
import passport from 'passport'
import inventoryController from '../controllers/inventoryController.js'
import { authorize } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get('/', inventoryController.getInventories)

router.get('/category/:category', inventoryController.getInventoriesByCategory)

router.get('/search', inventoryController.searchInventoriesByName)

router.get('/:id', inventoryController.getInventoryById)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    inventoryController.createInventory
)

router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator', 'service-technician']),
    inventoryController.updateInventory
)

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize(['administrator']),
    inventoryController.deleteInventory
)

export default router
