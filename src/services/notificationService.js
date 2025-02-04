import Notification from '../models/Notification.js'

const userRoleUpdated = async (user) => {
    const notification = new Notification({
        user: user._id,
        title: 'Role Update',
        message: `Your role has been updated to ${user.role}`,
        type: 'info',
        link: '/profile',
        isImportant: true,
    })
    return await notification.save()
}

const userEmailVerified = async (user) => {
    const notification = new Notification({
        user: user._id,
        title: 'Email Verification',
        message: `Your email has been verified`,
        type: 'success',
        link: '/profile',
    })
    return await notification.save()
}

const userPasswordChanged = async (user) => {
    const notification = new Notification({
        user: user._id,
        title: 'Password Changed',
        message: `Your password was changed`,
        type: 'alert',
        link: '/profile',
        isImportant: true,
    })
    return await notification.save()
}

const bookingCreated = async (booking) => {
    const notification = new Notification({
        user: booking.owner,
        title: 'Booking Created',
        message: `Congrats! You created a new booking`,
        type: 'success',
        link: `/bookings/${booking._id}`,
    })
    return await notification.save()
}

const bookingStatusUpdated = async (booking) => {
    const notification = new Notification({
        user: booking.owner._id,
        title: 'Booking Updated',
        message: `Your booking status is now ${booking.status}. ${booking.message}`,
        type: booking.status === 'booked' ? 'success' : 'alert',
        link: `/bookings/${booking._id}`,
        isImportant: booking.status === 'booked' ? false : true,
    })
    return await notification.save()
}

const paymentVerified = async (payment) => {
    const notification = new Notification({
        user: payment.user,
        title: 'Payment Completed',
        message: `Your payment status ${payment.status}`,
        type: 'success',
        link: `/payments`,
        isImportant: true,
    })
    return await notification.save()
}

const paymentFailed = async (payment) => {
    const notification = new Notification({
        user: payment.metadata.user,
        title: 'Payment Failed',
        message: `Your payment attempt ${payment.status}`,
        type: 'warning',
        link: `/carts`,
        isImportant: true,
    })
    return await notification.save()
}

const serviceCreated = async (user, service) => {
    const notification = new Notification({
        user: user._id,
        title: 'New Service Added',
        message: `IMPORTANT! A new ${service.category.toLowerCase()} service has been added`,
        type: 'general',
        link: `/services`,
        isImportant: true,
    })
    return await notification.save()
}

export default {
    userRoleUpdated,
    userEmailVerified,
    userPasswordChanged,
    bookingCreated,
    bookingStatusUpdated,
    paymentVerified,
    paymentFailed,
    serviceCreated,
}
