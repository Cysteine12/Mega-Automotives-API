import { Schema, model } from 'mongoose'

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
            required: true,
        },
        items: [
            {
                inventory: {
                    type: Schema.Types.ObjectId,
                    ref: 'Inventory',
                    required: true,
                },
                quantity: {
                    type: Number,
                    min: 1,
                    required: true,
                },
            },
        ],
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
)

export default model('Cart', cartSchema)
