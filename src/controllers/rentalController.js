import Vehicle from '../models/Vehicle.js'
import Rental from '../models/Rental.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getRentals = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const rentals = await Rental.find()
            .populate('vehicle')
            .sort({ updatedAt: -1 })
            .lean()

        const totalRentals = await Rental.countDocuments()

        res.status(200).json({
            success: true,
            data: rentals,
            total: totalRentals,
        })
    } catch (err) {
        next(err)
    }
}

const searchRentalsByLicenseNo = async (req, res, next) => {
    try {
        const { licenseNo } = req.query

        const rentals = await Rental.find()
            .populate('vehicle')
            .sort({ updatedAt: -1 })
            .lean()

        const filteredRentals = rentals.filter((rental) => {
            return rental.vehicle.licenseNo.includes(licenseNo)
        })

        res.status(200).json({
            success: true,
            data: filteredRentals,
        })
    } catch (err) {
        next(err)
    }
}

const getRentalById = async (req, res, next) => {
    try {
        const { id } = req.params

        const rental = await Rental.findById(id).populate('vehicle').lean()

        if (!rental) {
            throw new NotFoundError('Rental vehicle not found')
        }

        res.status(200).json({
            success: true,
            data: rental,
        })
    } catch (err) {
        next(err)
    }
}

const createRental = async (req, res, next) => {
    try {
        const owner = req.user._id
        const newVehicle = {
            category: req.body.category,
            licenseNo: req.body.licenseNo,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
            isRental: true,
        }
        const newRental = {
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            images: req.body.images,
            price: {
                perHour: req.body.price.perHour,
                perDay: req.body.price.perDay,
                perWeek: req.body.price.perWeek,
            },
            status: req.body.status,
        }

        const isExist = await Vehicle.findOne({
            licenseNo: newRental.licenseNo,
        }).lean()
        if (isExist) {
            throw new ValidationError(
                `This vehicle (${newRental.licenseNo}) already exists`
            )
        }

        const vehicle = new Vehicle({ owner, ...newVehicle })
        const savedVehicle = await vehicle.save()

        const rental = new Rental({
            vehicle: savedVehicle._id,
            ...newRental,
        })
        const savedRental = await rental.save()

        res.status(201).json({
            success: true,
            message: 'Rental vehicle added successfully',
            data: savedRental,
        })
    } catch (err) {
        next(err)
    }
}

const updateRental = async (req, res, next) => {
    try {
        const { id } = req.params
        const newRental = {
            description: req.body.description,
            thumbnail: req.body.thumbnail,
            images: req.body.images,
            price: {
                perHour: req.body.price.perHour,
                perDay: req.body.price.perDay,
                perWeek: req.body.price.perWeek,
            },
            status: req.body.status,
        }

        const updatedRental = await Rental.findByIdAndUpdate(id, newRental)

        if (!updatedRental) {
            throw new NotFoundError('Rental vehicle not found')
        }

        res.status(200).json({
            success: true,
            message: 'Rental profile updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteRental = async (req, res, next) => {
    try {
        const { id } = req.params

        const { vehicle: vehicleId } = await Rental.findById(id)
            .select('vehicle')
            .lean()

        const [rental, vehicle] = await Promise.all([
            Rental.findByIdAndDelete(id),
            Vehicle.findByIdAndDelete(vehicleId),
        ])

        if (!rental || !vehicle) {
            throw new NotFoundError('Rental vehicle not found')
        }

        res.status(200).json({
            success: true,
            message: 'Rental profile deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getRentals,
    searchRentalsByLicenseNo,
    getRentalById,
    createRental,
    updateRental,
    deleteRental,
}
