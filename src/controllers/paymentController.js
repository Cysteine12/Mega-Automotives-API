import Payment from '../models/Payment.js'
import paymentService from '../services/paymentService.js'
import notificationService from '../services/notificationService.js'
import emailService from '../services/emailService.js'
import { PaymentAPIError } from '../middlewares/errorHandler.js'

const getPayments = async (req, res, next) => {
    try {
        const user = req.user._id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const payments = await Payment.find({ user })
            .populate('assignedTo')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const totalPayments = await Payment.find({ user }).countDocuments()

        res.status(200).json({
            success: true,
            data: payments,
            total: totalPayments,
        })
    } catch (err) {
        next(err)
    }
}

const initializePayment = async (req, res, next) => {
    try {
        const data = {
            email: req.user.email,
            amount: req.body.amount * 100,
            metadata: {
                user: req.user._id,
                assignedTo: req.body.assignedTo,
                assignedToModel: req.body.assignedToModel,
            },
        }

        const response = await paymentService.startPayment(data)
        res.status(200).json({
            success: true,
            data: response.data.data.authorization_url,
        })
    } catch (err) {
        next(err)
    }
}

const verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.params

        const response = await paymentService.recordPayment(reference)

        if (response.data.data.status !== 'success') {
            await notificationService.paymentFailed(response.data.data)

            throw new PaymentAPIError(
                `Payment verification ${response.data.data.status}`
            )
        }

        const newPayment = {
            ...response.data.data.metadata,
            amount: response.data.data.amount / 100,
            reference: response.data.data.reference,
            method: response.data.data.channel,
            status: response.data.data.status,
        }

        const payment = new Payment(newPayment)
        const savedPayment = await payment.save()

        await notificationService.paymentVerified(savedPayment)

        await emailService.sendPaymentVerificationMail(
            response.data.data.customer.email,
            savedPayment
        )

        res.status(200).json({
            success: true,
            data: savedPayment,
            message: 'Payment verification successful',
        })
    } catch (err) {
        next(err)
    }
}

export default {
    getPayments,
    initializePayment,
    verifyPayment,
}
