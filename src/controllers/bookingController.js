import Booking from '../models/Booking.js'
import User from '../models/User.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const bookings = await Booking.find()
            .populate('owner vehicles assignedTo', '-password')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalBookings = await Booking.find().countDocuments()

        res.status(200).json({
            success: true,
            data: bookings,
            total: totalBookings,
        })
    } catch (err) {
        next(err)
    }
}

const getBookingsByStatus = async (req, res, next) => {
    try {
        const { status } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const bookings = await Booking.find({ status })
            .populate('owner vehicles assignedTo', '-password')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalBookings = await Booking.find({ status }).countDocuments()

        res.status(200).json({
            success: true,
            data: bookings,
            total: totalBookings,
        })
    } catch (err) {
        next(err)
    }
}

const getBookingsByOwner = async (req, res, next) => {
    try {
        const owner = req.params.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const bookings = await Booking.find({ owner })
            .populate('owner vehicles assignedTo', '-password')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalBookings = await Booking.find({ owner }).countDocuments()

        res.status(200).json({
            success: true,
            data: bookings,
            total: totalBookings,
        })
    } catch (err) {
        next(err)
    }
}

const searchBookingsByOwner = async (req, res, next) => {
    try {
        const { name } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            $text: {
                $search: name,
            },
            _id: {
                $nin: [req.user._id],
            },
            role: {
                $nin: ['service-technician', 'administrator'],
            },
        })
            .select('_id')
            .lean()

        const userIds = users.map((user) => user._id)

        const bookings = await Booking.find({
            owner: {
                $in: userIds,
            },
        })
            .populate('owner vehicles assignedTo', '-password')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalBookings = await Booking.find({
            owner: {
                $in: userIds,
            },
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

const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params

        const booking = await Booking.findById(id)
            .populate('owner vehicles assignedTo', '-password')
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

const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { message, status } = req.body

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { message, status },
            { new: true }
        ).populate('owner')

        await notificationService.bookingStatusUpdated(updatedBooking)

        await emailService.sendBookingStatusMail(updatedBooking)

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params

        const booking = await Booking.findOneAndDelete({
            _id: id,
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
    getBookings,
    getBookingsByStatus,
    getBookingsByOwner,
    searchBookingsByOwner,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
}
