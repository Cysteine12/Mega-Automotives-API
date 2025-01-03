import { Schema, model } from 'mongoose'

const vehicleSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['motorcycle', 'tricycle', 'car', 'truck', 'bus', 'others'],
            required: true,
        },
        licenseNo: {
            type: String,
            length: 7,
            unique: true,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            length: 4,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        isRental: {
            type: Boolean,
            default: 'false',
        },
    },
    {
        timestamps: true,
    }
)

vehicleSchema.index({ licenseNo: 'text' })

export default model('Vehicle', vehicleSchema)
