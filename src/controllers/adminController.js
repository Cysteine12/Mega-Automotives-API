import User from '../models/User.js'
import Payment from '../models/Payment.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            _id: {
                $nin: [req.user.id],
            },
        })
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
            .select('_id name photo')
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
        }).lean()

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
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
            isVerified: true,
        }

        const isExist = await User.findOne({ email: newUser.email })
            .select('_id')
            .lean()
        if (isExist) {
            throw new ValidationError('This email already exists')
        }

        const user = new User(newUser)
        const savedUser = await user.save()

        await emailService.sendWelcomeMailFromAdmin(savedUser)

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
            password: req.body.password,
            phone: req.body.phone,
        }

        const updatedUser = await User.findByIdandUpdate(id, newUser)

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
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        res.status(200).json({
            success: true,
            data: payments,
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
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        res.status(200).json({
            success: true,
            data: payments,
        })
    } catch (err) {
        next(err)
    }
}

export default {
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
}
