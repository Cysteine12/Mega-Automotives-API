import User from '../models/User.js'
import Payment from '../models/Payment.js'
import Vehicle from '../models/Vehicle.js'
import Booking from '../models/Booking.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import { v4 as uuidv4 } from 'uuid'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const dashboard = async (req, res, next) => {
    try {
        const [
            totalCustomers,
            payments,
            totalVehicles,
            totalRentalBookings,
            totalPendingRentalBookings,
            totalServiceBookings,
            totalPendingServiceBookings,
        ] = await Promise.all([
            User.find({ role: 'customer' }).countDocuments(),
            Payment.find().lean(),
            Vehicle.find().countDocuments(),
            Booking.find({ assignedToModel: 'Rental' }).countDocuments(),
            Booking.find({
                assignedToModel: 'Rental',
                status: 'booked',
            }).countDocuments(),
            Booking.find({ assignedToModel: 'Subservice' }).countDocuments(),
            Booking.find({
                assignedToModel: 'Subservice',
                status: 'booked',
            }).countDocuments(),
        ])

        const totalPayments = payments.reduce((pre, cur) => pre + cur.amount, 0)

        res.status(200).json({
            success: true,
            total: {
                totalCustomers,
                totalPayments,
                totalVehicles,
                totalRentalBookings,
                totalPendingRentalBookings,
                totalServiceBookings,
                totalPendingServiceBookings,
            },
        })
    } catch (err) {
        next(err)
    }
}

const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            _id: {
                $nin: [req.user.id],
            },
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalUsers = await User.find({
            _id: {
                $nin: [req.user.id],
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: users,
            total: totalUsers,
        })
    } catch (err) {
        next(err)
    }
}

const getUsersByRole = async (req, res, next) => {
    try {
        const { role } = req.params
        const { _id } = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            role,
            _id: {
                $nin: [_id],
            },
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalUsers = await User.find({
            role,
            _id: {
                $nin: [_id],
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: users,
            total: totalUsers,
        })
    } catch (err) {
        next(err)
    }
}

const searchUsersByName = async (req, res, next) => {
    try {
        const { name } = req.query
        const { _id } = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            $text: {
                $search: name,
            },
            _id: {
                $nin: [_id],
            },
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalUsers = await User.find({
            $text: {
                $search: name,
            },
            _id: {
                $nin: [_id],
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: users,
            total: totalUsers,
        })
    } catch (err) {
        next(err)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const { _id } = req.user._id

        const user = await User.findOne({
            _id: {
                $in: [id],
                $nin: [_id],
            },
        })
            .select('-password')
            .lean()

        if (!user) {
            throw new NotFoundError('This user no longer exist')
        }

        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (err) {
        next(err)
    }
}

const createUser = async (req, res, next) => {
    try {
        const newUser = {
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName,
            },
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
            isVerified: true,
        }

        let user = await User.findOne({ email: newUser.email })
            .select('_id')
            .lean()
        if (user) {
            throw new ValidationError('This email already exists')
        }

        const verificationToken = uuidv4()

        user = new User({
            ...newUser,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
        })
        const savedUser = await user.save()

        const verifyUrl = `${process.env.ORIGIN_URL}/verify-email/${verificationToken}`

        await emailService.sendWelcomeMailFromAdmin(savedUser, verifyUrl)

        res.status(200).json({
            success: true,
            message: 'User account created successfully',
            data: savedUser,
        })
    } catch (err) {
        next(err)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const newUser = {
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName,
            },
            email: req.body.email,
            phone: req.body.phone,
        }

        const updatedUser = await User.findByIdAndUpdate(id, newUser)

        if (!updatedUser) {
            throw new NotFoundError('User not found')
        }

        res.status(200).json({
            success: true,
            message: 'User account updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params
        const { role } = req.body

        const updatedUser = await User.findByIdAndUpdate(id, { role })

        if (!updatedUser) {
            throw new NotFoundError('User not found')
        }

        await notificationService.userRoleUpdated(updatedUser)

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            throw new NotFoundError('User not found')
        }

        res.status(200).json({
            success: true,
            message: 'User account deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

const getPayments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const payments = await Payment.find()
            .populate('user', '_id name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalPayments = await Payment.find().countDocuments()

        res.status(200).json({
            success: true,
            data: payments,
            total: totalPayments,
        })
    } catch (err) {
        next(err)
    }
}

const getPaymentsByUser = async (req, res, next) => {
    try {
        const user = req.params.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const payments = await Payment.find({ user })
            .populate('user', '_id name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalPayments = await Payment.find({ user }).countDocuments()

        res.status(200).json({
            success: true,
            data: payments,
            total: totalPayments,
        })
    } catch (err) {
        next(err)
    }
}

const searchPaymentByReference = async (req, res, next) => {
    try {
        const { reference } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const payments = await Payment.find({
            $text: {
                $search: reference,
            },
        })
            .populate('user', '_id name')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalPayments = await Payment.find({
            $text: {
                $search: reference,
            },
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: payments,
            total: totalPayments,
        })
    } catch (err) {
        next(err)
    }
}

const getPayment = async (req, res, next) => {
    try {
        const { id } = req.params

        const payment = await Payment.findById(id)
            .populate('user assignedTo', '_id name')
            .lean()

        if (!payment) {
            throw new NotFoundError('Payment not found')
        }

        res.status(200).json({
            success: true,
            data: payment,
        })
    } catch (err) {
        next(err)
    }
}

const updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('user', '_id name email')
            .lean()

        if (!updatedPayment) {
            throw new NotFoundError('Payment not found')
        }

        await notificationService.paymentStatusUpdated(updatedPayment)

        await emailService.sendPaymentStatusMail(updatedPayment)

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
        })
    } catch (err) {
        next(err)
    }
}

const deletePayment = async (req, res, next) => {
    try {
        const { id } = req.params

        const payment = await Payment.findByIdAndDelete(id)

        if (!payment) {
            throw new NotFoundError('Payment not found')
        }

        res.status(200).json({
            success: true,
            message: 'Payment record deleted successfully',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    dashboard,
    getUsers,
    getUsersByRole,
    searchUsersByName,
    getUserById,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    getPayments,
    getPaymentsByUser,
    searchPaymentByReference,
    getPayment,
    updatePaymentStatus,
    deletePayment,
}
