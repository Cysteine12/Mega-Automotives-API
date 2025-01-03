import { Schema, model } from 'mongoose'

const inventorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['parts', 'accessories'],
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        make: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        modelNo: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            min: 0,
            required: true,
        },
        price: {
            type: Number,
            min: 0,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        status: {
            type: String,
            enum: ['Available', 'Out of Stock', 'Discontinued'],
            default: 'Available',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

inventorySchema.index({ name: 'text' })

export default model('Inventory', inventorySchema)
