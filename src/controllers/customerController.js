import mongoose from 'mongoose'
import Vehicle from '../models/Vehicle.js'
import Booking from '../models/Booking.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getVehicles = async (req, res, next) => {
    try {
        const owner = new mongoose.Types.ObjectId(req.user._id)
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const vehicles = await Vehicle.find({ owner })
            .sort({ createdAt: -1 })
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

const getVehicleById = async (req, res, next) => {
    try {
        const _id = req.params.id
        const owner = new mongoose.Types.ObjectId(req.user._id)

        const vehicle = await Vehicle.findOne({ _id, owner }).lean()

        if (!vehicle) {
            throw new NotFoundError('Vehicle not found')
        }

        res.status(200).json({
            success: true,
            data: vehicle,
        })
    } catch (err) {
        next(err)
    }
}

const createVehicle = async (req, res, next) => {
    try {
        const owner = req.user._id
        const newVehicle = {
            category: req.body.category,
            licenseNo: req.body.licenseNo,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
        }

        const isExist = await Vehicle.findOne({
            licenseNo: newVehicle.licenseNo,
        })
            .select('_id')
            .lean()
        if (isExist) {
            throw new ValidationError(
                `This vehicle (${newVehicle.licenseNo}) already exists`
            )
        }

        const vehicle = new Vehicle({ owner, ...newVehicle })
        const savedVehicle = await vehicle.save()

        res.status(201).json({
            success: true,
            message: 'Vehicle profile added successfully',
            data: savedVehicle,
        })
    } catch (err) {
        next(err)
    }
}

const updateVehicle = async (req, res, next) => {
    try {
        const _id = req.params.id
        const owner = new mongoose.Types.ObjectId(req.user._id)
        const newVehicle = {
            category: req.body.category,
            licenseNo: req.body.licenseNo,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
        }

        const updatedVehicle = await Vehicle.findOneAndUpdate(
            {
                _id,
                owner,
            },
            newVehicle
        )

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
        const _id = req.params.id
        const owner = new mongoose.Types.ObjectId(req.user._id)

        const vehicle = await Vehicle.findOneAndDelete({ _id, owner })

        if (!vehicle) {
            throw new NotFoundError('Vehicle not found')
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle profile has been deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

const getBookings = async (req, res, next) => {
    try {
        const owner = new mongoose.Types.ObjectId(req.user._id)
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const bookings = await Booking.find({ owner })
            .populate('vehicle assignedTo')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalBookings = await Booking.find({
            owner,
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: bookings,
            total: totalBookings,
        })
    } catch (err) {
        next(err)
    }
}

const getBooking = async (req, res, next) => {
    try {
        const _id = req.params.id
        const owner = new mongoose.Types.ObjectId(req.user._id)

        const booking = await Booking.findOne({ _id, owner })
            .populate('vehicle assignedTo')
            .lean()

        if (!booking) {
            throw new NotFoundError('Booking not found')
        }

        res.status(200).json({
            success: true,
            data: booking,
        })
    } catch (err) {
        next(err)
    }
}

const createBooking = async (req, res, next) => {
    try {
        const user = req.user
        const newBooking = {
            vehicle: req.body.vehicle,
            assignedTo: req.body.assignedTo,
            assignedToModel: req.body.assignedToModel,
            description: req.body.description,
            schedule: {
                pickUp: req.body.schedule.pickUp,
                dropOff: req.body.schedule.dropOff,
            },
            photos: {
                photoBefore: req.body.photos.photoBefore,
                license: req.body.photos.license,
            },
        }

        const booking = new Booking({
            owner: user._id,
            ...newBooking,
        })
        const savedBooking = await booking.save()

        await notificationService.bookingCreated(savedBooking)

        await emailService.sendNewBookingMail(user, savedBooking)

        res.status(200).json({
            success: true,
            message: 'Booking placed successfully',
            data: savedBooking,
        })
    } catch (err) {
        next(err)
    }
}

const updateBooking = async (req, res, next) => {
    try {
        const _id = req.params.id
        const owner = new mongoose.Types.ObjectId(req.user._id)
        const newBooking = {
            vehicle: req.body.vehicle,
            assignedTo: req.body.assignedTo,
            assignedToModel: req.body.assignedToModel,
            description: req.body.description,
            schedule: {
                pickUp: req.body.schedule.pickUp,
                dropOff: req.body.schedule.dropOff,
            },
            photos: {
                photoBefore: req.body.photos.photoBefore,
                photoAfter: req.body.photos.photoAfter,
                license: req.body.photos.license,
            },
        }

        const booking = await Booking.findOne({ _id, owner })
            .select('status')
            .lean()

        if (!booking) {
            throw new NotFoundError(`Booking not found`)
        }
        if (!['booked', 'confirmed'].includes(booking.status)) {
            throw new ValidationError(
                `This booking has already been ${booking.status}`
            )
        }

        await Booking.findByIdAndUpdate(_id, newBooking)

        res.status(200).json({
            success: true,
            message: 'Booking details updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteBooking = async (req, res, next) => {
    try {
        const owner = new mongoose.Types.ObjectId(req.user._id)
        const { id } = req.params

        const booking = await Booking.findOneAndDelete({
            _id: id,
            owner,
            status: {
                $in: ['booked', 'confirmed', 'cancelled'],
            },
        })

        if (!booking) {
            throw new NotFoundError('Booking not found or cannot be deleted')
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
}
