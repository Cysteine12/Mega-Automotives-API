import Inventory from '../models/Inventory.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getInventories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const inventories = await Inventory.find()
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalInventories = await Inventory.countDocuments()

        res.status(200).json({
            success: true,
            data: inventories,
            total: totalInventories,
        })
    } catch (err) {
        next(err)
    }
}

const getInventoriesByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const inventories = await Inventory.find({ category })
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalInventories = await Inventory.find({
            category,
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: inventories,
            total: totalInventories,
        })
    } catch (err) {
        next(err)
    }
}

const searchInventoriesByName = async (req, res, next) => {
    try {
        const { name } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const inventories = await Inventory.find({
            $text: {
                $search: name,
            },
        })
            .select('_id name thumbnail')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalInventories = await Inventory.find({
            $text: {
                $search: name,
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: inventories,
            total: totalInventories,
        })
    } catch (err) {
        next(err)
    }
}

const getInventoryById = async (req, res, next) => {
    try {
        const { id } = req.params

        const inventory = await Inventory.findById(id).lean()

        if (!inventory) {
            throw new NotFoundError('Inventory not found')
        }

        res.status(200).json({
            success: true,
            data: inventory,
        })
    } catch (err) {
        next(err)
    }
}

const createInventory = async (req, res, next) => {
    try {
        const newInventory = {
            name: req.body.name,
            category: req.body.category,
            brand: req.body.brand,
            make: req.body.make,
            model: req.body.model,
            modelNo: req.body.modelNo,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            images: req.body.images,
            status: req.body.status,
        }

        const inventory = new Inventory(newInventory)
        const savedInventory = await inventory.save()

        res.status(200).json({
            success: true,
            message: 'Inventory added successfully',
            data: savedInventory,
        })
    } catch (err) {
        next(err)
    }
}

const updateInventory = async (req, res, next) => {
    try {
        const { id } = req.params
        const newInventory = {
            name: req.body.name,
            category: req.body.category,
            brand: req.body.brand,
            make: req.body.make,
            model: req.body.model,
            modelNo: req.body.modelNo,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            images: req.body.images,
            status: req.body.status,
        }

        const updatedInventory = await Inventory.findByIdAndUpdate(
            id,
            newInventory
        )

        if (!updatedInventory) {
            throw new NotFoundError('Inventory not found')
        }

        res.status(200).json({
            success: true,
            message: 'Inventory updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteInventory = async (req, res, next) => {
    try {
        const { id } = req.params

        const inventory = await Inventory.findByIdAndDelete(id)

        if (!inventory) {
            throw new NotFoundError('Inventory not found')
        }

        res.status(200).json({
            success: true,
            message: 'Inventory deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getInventories,
    getInventoriesByCategory,
    searchInventoriesByName,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
}
