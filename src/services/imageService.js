import cloudinary from '../config/cloudinary.js'

const signuploadform = (paramsToSign) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const api_secret = cloudinary.config().api_secret

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            ...paramsToSign,
        },
        api_secret
    )

    return { timestamp, signature }
}

export default { signuploadform }
