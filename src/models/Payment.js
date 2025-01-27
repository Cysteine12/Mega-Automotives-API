import { Schema, model } from 'mongoose'

const paymentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: [
            {
                type: Schema.Types.ObjectId,
                refPath: 'assignedToModel',
                populate: true,
                required: true,
            },
        ],
        assignedToModel: {
            type: String,
            enum: ['Inventory', 'Service', 'Rental'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reference: {
            type: String,
            required: true,
            unique: true,
        },
        method: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed', 'refunded'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
)

export default model('Payment', paymentSchema)
