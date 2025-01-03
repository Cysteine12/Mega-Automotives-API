import cloudinary from '../config/cloudinary.js'

const signuploadform = () => {
    const timestamp = Math.round(newDate.getTime() / 1000)
    const api_secret = cloudinary.config().api_secret

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
            folder: 'mega_automotives',
        },
        api_secret
    )

    return { timestamp, signature }
}

export default { signuploadform }