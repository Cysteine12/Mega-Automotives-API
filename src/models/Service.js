import { Schema, model } from 'mongoose'

const serviceSchema = new Schema(
    {
        category: {
            type: String,
            enum: ['Auto Repair', 'Car Wash', 'Body Shop'],
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        subservices: {
            type: [Schema.Types.ObjectId],
            ref: 'Subservice',
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model('Service', serviceSchema)
