import { Schema, model } from 'mongoose'

const subserviceSchema = new Schema(
    {
        name: {
            type: String,
            enum: [
                //To be removed
                'Oil Change',
                'Brake Repair',
                'Engine Repair',
                'Diagnostic Scan & Electrical',
                'AC Repair & Regas',
                'Alignment & Camber',
                'Buff & Polish',
                'Complete Wash',
                'Shampoo Upholstery',
                'Engine/Under Wash',
                'Microfine',
                'Repaint/Touch-Up',
                'Polish Headlights',
                'Repair Dents/Accidents',
                'Ceramic Coating',
                'Rim Repair',
            ],
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model('Subservice', subserviceSchema)
