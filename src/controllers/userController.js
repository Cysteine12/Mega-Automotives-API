import User from '../models/User.js'
import { NotFoundError, ValidationError } from '../middlewares/errorHandler.js'
import imageService from '../services/imageService.js'

const getProfile = async (req, res, next) => {
    const user = req.user

    res.status(200).json({
        success: true,
        user: user,
    })
}

const updateProfile = async (req, res, next) => {
    try {
        const { _id } = req.user
        const newUser = {
            name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName,
            },
            phone: req.body.phone,
        }

        let updatedUser = await User.findByIdAndUpdate(_id, newUser)

        if (!updatedUser) {
            throw new NotFoundError('User not found')
        }

        updatedUser = {
            _id: updatedUser._id,
            name: {
                firstName: updatedUser.name.firstName,
                lastName: updatedUser.name.lastName,
            },
            email: updatedUser.email,
            phone: updatedUser.phone,
            photo: updatedUser.photo,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        })
    } catch (err) {
        next(err)
    }
}

const uploadPhoto = () => {
    try {
        const { signature, timestamp } = imageService.signuploadform()

        res.status(200).json({
            signature: signature,
            timestamp: timestamp,
            cloudname: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: proccess.env.CLOUDINARY_API_KEY,
        })
    } catch (err) {
        next(err)
    }
}

const deleteProfile = async (req, res, next) => {
    try {
        const { _id } = req.user

        const user = await User.findByIdAndDelete(_id)

        if (!user) {
            throw new NotFoundError('User not found')
        }

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully!',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getProfile,
    updateProfile,
    uploadPhoto,
    deleteProfile,
}
