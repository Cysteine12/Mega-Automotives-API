import { Schema, model } from 'mongoose'

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['general', 'info', 'alert', 'warning', 'success'],
            required: true,
        },
        link: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['read', 'unread'],
            default: 'unread',
        },
        isImportant: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export default model('Notification', notificationSchema)
