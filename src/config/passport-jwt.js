import { Strategy as JwtStrategy } from 'passport-jwt'
import User from '../models/User.js'

export default (passport) => {
    const cookieExtractor = (req) => {
        let token
        if (req && req.cookies) {
            token = req.cookies.accessToken
        }
        return token
    }

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            },
            async (payload, done) => {
                try {
                    const user = await User.findOne({ _id: payload._id })

                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                } catch (err) {
                    return done(err, false)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id)
            return done(null, user)
        } catch (err) {
            return done(err, null)
        }
    })
}
