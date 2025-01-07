import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
    {
        name: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            min: 7,
            required: false,
        },
        phone: {
            type: Number,
            length: 10,
            required: false,
        },
        photo: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: [
                'customer',
                'administrator',
                'service-technician',
                'insurance-company',
            ],
            default: 'customer',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: Array,
            default: null,
        },
        emailVerificationToken: {
            type: String,
            default: null,
        },
        emailVerificationTokenExpire: {
            type: Date,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.index({
    'name.firstName': 'text',
    'name.lastName': 'text',
})

export default model('User', userSchema)
