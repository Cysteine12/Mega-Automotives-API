import Notification from '../models/Notification.js'
import { NotFoundError } from '../middlewares/errorHandler.js'

const getNotifications = async (req, res, next) => {
    try {
        const user = req.user._id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const notifications = await Notification.find({
            $or: [
                { user },
                {
                    type: 'general',
                },
            ],
        })
            .select('-user')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalNotifications = await Notification.find({
            $or: [
                { user },
                {
                    type: 'general',
                },
            ],
        }).countDocuments()

        res.status(200).json({
            success: true,
            data: notifications,
            total: totalNotifications,
        })
    } catch (err) {
        next(err)
    }
}

const updateNotificationStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user._id

        const updatedNotification = await Notification.findOneAndUpdate(
            {
                _id: id,
                user,
            },
            {
                status: 'read',
            }
        )

        if (!updatedNotification) {
            throw new NotFoundError('Error updating notification status')
        }

        res.status(200).json({
            success: true,
        })
    } catch (err) {
        next(err)
    }
}

export default { getNotifications, updateNotificationStatus }
