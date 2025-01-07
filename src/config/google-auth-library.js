import { OAuth2Client } from 'google-auth-library'
import { UnauthenticatedError } from '../middlewares/errorHandler.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const verifyGoogleAccessToken = async (req, res, next) => {
    try {
        const { access_token } = req.body

        if (!access_token) {
            throw new UnauthenticatedError('Access token is required')
        }

        client.setCredentials({ access_token })

        const userinfo = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        })

        if (!userinfo.data.email_verified) {
            throw new UnauthenticatedError('Email not verified')
        }

        req.user = {
            name: {
                firstName: userinfo.data.given_name,
                lastName: userinfo.data.family_name,
            },
            email: userinfo.data.email,
            // phone: userinfo.data.profile,
            photo: userinfo.data.picture,
            isVerified: userinfo.data.email_verified,
        }

        next()
    } catch (err) {
        next(err)
    }
}
