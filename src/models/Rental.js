import { Schema, model } from 'mongoose'

const rentalSchema = new Schema(
    {
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        price: {
            perHour: {
                type: String,
                required: true,
            },
            perDay: {
                type: String,
                required: true,
            },
            perWeek: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['available', 'in-use', 'unavailable'],
            default: 'available',
        },
    },
    {
        timestamps: true,
    }
)

export default model('Rental', rentalSchema)
