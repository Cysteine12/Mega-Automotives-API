import Vehicle from '../models/Vehicle.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getVehicles = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const vehicles = await Vehicle.find()
            .populate('owner', '_id name')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalVehicles = await Vehicle.find().countDocuments()

        res.status(200).json({
            success: true,
            data: vehicles,
            total: totalVehicles,
        })
    } catch (err) {
        next(err)
    }
}

const getVehiclesByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const vehicles = await Vehicle.find({ category })
            .populate('owner', '_id name')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalVehicles = await Vehicle.find({ category }).countDocuments()

        res.status(200).json({
            success: true,
            data: vehicles,
            total: totalVehicles,
        })
    } catch (err) {
        next(err)
    }
}

const getVehiclesByOwnerId = async (req, res, next) => {
    try {
        const owner = req.params.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const vehicles = await Vehicle.find({ owner })
            .populate('owner', '_id name')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalVehicles = await Vehicle.find({ owner }).countDocuments()

        res.status(200).json({
            success: true,
            data: vehicles,
            total: totalVehicles,
        })
    } catch (err) {
        next(err)
    }
}

const searchVehiclesByLicenseNo = async (req, res, next) => {
    try {
        const { licenseNo } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const vehicles = await Vehicle.find({
            $text: {
                $search: licenseNo,
            },
        })
            .populate('owner', '_id name')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalVehicles = await Vehicle.find({
            $text: {
                $search: licenseNo,
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: vehicles,
            total: totalVehicles,
        })
    } catch (err) {
        next(err)
    }
}

const getVehicleById = async (req, res, next) => {
    try {
        const { id } = req.params

        const vehicle = await Vehicle.findById(id)
            .populate('owner', '_id name')
            .lean()

        res.status(200).json({
            success: true,
            data: vehicle,
        })
    } catch (err) {
        next(err)
    }
}

const updateVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const newVehicle = {
            category: req.body.category,
            licenseNo: req.body.licenseNo,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, newVehicle)

        if (!updatedVehicle) {
            throw new NotFoundError('Vehicle not found')
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle profile updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params

        const vehicle = await Vehicle.findByIdAndDelete(id)

        if (!vehicle) {
            throw new NotFoundError('Vehicle not found')
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle profile deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getVehicles,
    getVehicleById,
    getVehiclesByCategory,
    getVehiclesByOwnerId,
    searchVehiclesByLicenseNo,
    updateVehicle,
    deleteVehicle,
}
