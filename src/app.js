import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from './middlewares/logger.js'
import DB from './config/db.js'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import passportJWT from './config/passport-jwt.js'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js'

const app = express()

//=======Middlewares======//
if (process.env.NODE_ENV !== 'production') {
    app.use(logger)
}

app.use(
    cors({
        origin: process.env.ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders:
            'Accept, Accept-Language, X-Requested-With, Content-Language, Content-Type, Origin, Authorization',
        optionsSuccessStatus: 200,
        credentials: true,
    })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

DB.connect()

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    })
)

passportJWT(passport)
app.use(passport.initialize())
app.use(passport.session())

//=======Routes========//
import authRoutes from './routes/authRoutes.js'
app.use('/api/auth', authRoutes)

import userRoutes from './routes/userRoutes.js'
app.use('/api/users', userRoutes)

import notificationRoutes from './routes/notificationRoutes.js'
app.use('/api/notifications', notificationRoutes)

import vehicleRoutes from './routes/vehicleRoutes.js'
app.use('/api/vehicles', vehicleRoutes)

import rentalRoutes from './routes/rentalRoutes.js'
app.use('/api/rentals', rentalRoutes)

import serviceRoutes from './routes/serviceRoutes.js'
app.use('/api/services', serviceRoutes)

import bookingRoutes from './routes/bookingRoutes.js'
app.use('/api/bookings', bookingRoutes)

import inventoryRoutes from './routes/inventoryRoutes.js'
app.use('/api/inventories', inventoryRoutes)

import cartRoutes from './routes/cartRoutes.js'
app.use('/api/carts', cartRoutes)

// import paymentRoutes from './routes/paymentRoutes.js'
// app.use('/api/payments', paymentRoutes)

import customerRoutes from './routes/customerRoutes.js'
app.use('/api/customer', customerRoutes)

import technicianRoutes from './routes/technicianRoutes.js'
app.use('/api/technician', technicianRoutes)

import adminRoutes from './routes/adminRoutes.js'
app.use('/api/admin', adminRoutes)

//=======Error Handler=======//
app.use(notFoundHandler)
app.use(errorHandler)

//=======........========//
const PORT = process.env.PORT

app.listen(PORT, console.log(`Server started on port ${PORT}`))
