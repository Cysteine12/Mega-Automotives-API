import { Schema, model } from 'mongoose'

const bookingSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vehicles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Vehicle',
                required: true,
            },
        ],
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
            enum: ['Subservice', 'Rental'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        schedule: {
            pickUp: {
                date: {
                    type: String,
                    required: true,
                },
                time: {
                    type: String,
                    required: true,
                },
            },
            dropOff: {
                date: {
                    type: String,
                    required: true,
                },
                time: {
                    type: String,
                    required: true,
                },
            },
        },
        photos: {
            photoBefore: {
                type: String,
                required: false,
            },
            photoAfter: {
                type: String,
                required: false,
            },
            license: {
                type: String,
                required: false,
            },
        },
        message: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: [
                'booked',
                'confirmed',
                'in-progress',
                'completed',
                'cancelled',
            ],
            default: 'booked',
        },
    },
    {
        timestamps: true,
    }
)

bookingSchema.pre('find', function (next) {
    const query = this.getQuery()

    switch (query.assignedToModel) {
        case 'service':
            query.assignedToModel = 'Subservice'
            break

        case 'rental':
            query.assignedToModel = 'Rental'
            break
    }
    next()
})

bookingSchema.post('save', function (doc, next) {
    switch (doc.assignedToModel) {
        case 'Subservice':
            doc.assignedToModel = 'service'
            break

        case 'Rental':
            doc.assignedToModel = 'rental'
            break
    }
    next()
})

bookingSchema.post('findOneAndUpdate', function (doc, next) {
    switch (doc.assignedToModel) {
        case 'Subservice':
            doc.assignedToModel = 'service'
            break

        case 'Rental':
            doc.assignedToModel = 'rental'
            break
    }
    next()
})

export default model('Booking', bookingSchema)
