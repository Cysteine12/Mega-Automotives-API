import axios from 'axios'

const startPayment = async (data) => {
    return await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: data.email,
            amount: data.amount,
            metadata: data.metadata,
            callback_url: `${process.env.ORIGIN_URL}/payments/verify`,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    )
}

const recordPayment = async (reference) => {
    return await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        }
    )
}

export default {
    startPayment,
    recordPayment,
}
