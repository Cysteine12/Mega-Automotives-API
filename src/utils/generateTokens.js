import jwt from 'jsonwebtoken'

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3h',
    })
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    })
}

export { generateAccessToken, generateRefreshToken }
