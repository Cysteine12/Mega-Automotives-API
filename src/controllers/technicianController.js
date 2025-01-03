import User from '../models/User.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'

const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const users = await User.find({
            role: {
                $nin: ['service-technician', 'administrator'],
            },
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalUsers = await User.find({
            role: {
                $nin: ['service-technician', 'administrator'],
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
            role: {
                $nin: ['service-technician', 'administrator'],
            },
        })
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
            role: {
                $nin: ['service-technician', 'administrator'],
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
        const { _id } = req.user

        const user = await User.findOne({
            _id: {
                $in: [id],
                $nin: [_id],
            },
            role: {
                $nin: ['service-technician', 'administrator'],
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

export default {
    getUsers,
    searchUsersByName,
    getUserById,
}
