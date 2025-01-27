import sendEmail from '../config/sendEmail.js'

const sendWelcomeMailFromAdmin = async (savedUser) => {
    return await sendEmail({
        to: savedUser.email,
        subject: 'Welcome to the Mega-Automotives family!',
        html: `<h3>Hello ${savedUser.name.firstName},</h3>
            <br/>
            Welcome to Mega-Automotives. It's great to have you on our team!
            <br/><br/>
            Your user account has been created and we are delighted to have you.
            <br/><br/>
            You can proceed to contact the company admin for your details and sign-in here:
            <br/><br/>
            <a href="${process.env.ORIGIN_URL}/login" 
                style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;"
            >
                Sign In
            </a>
            <br/><br/>
            Warm Regards, 
            Mega-Automotives Team.
        `,
    })
}

const sendWelcomeMail = async (savedUser, verifyUrl) => {
    return await sendEmail({
        to: savedUser.email,
        subject: 'Confirm your email address',
        html: `<h3>Hello, ${savedUser.name.firstName}</h3>
            There's one quick step you need to complete for creating an account. 
            Let's make sure this is the right email address for you - 
            please confirm that this is the right address to use for your new account.
            Please use this verification link to get started on Mega-Automotives:
            <br/>
            <a href="${verifyUrl}" style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;">
                Verify Email
            </a>
            This link expires after 24 hours. If you did not request this, kindly ignore.
            <br/><br/>
            Warm Regards,
            <br/>
            Mega-Automotives Team.
        `,
    })
}

const sendForgotPasswordMail = async (email, resetUrl) => {
    return await sendEmail({
        to: email,
        subject: 'Mega-Automotives Account Password Reset',
        html: `<h3>Dear valued user,</h3>
            You are receiving this email because you requested a password reset.
            Please use the following link to reset your password:
            <br/><br/>
            <a href="${resetUrl}" style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;">
                Reset Password
            </a>
            <br/><br/>
            If you did not request this, kindly ignore.
            <br/><br/>
            Thanks,
            <br/>
            Mega-Automotives Team.
        `,
    })
}

const sendEmailVerificationMail = async (user) => {
    return await sendEmail({
        to: user.email,
        subject: 'Welcome to the Mega-Automotives family!',
        html: `<h3>Hey ${user.name.firstName},</h3>
            <br/>
            Welcome to Mega-Automotives. It's great to meet you!
            <br/><br/>
            Your email has been confirmed and we are delighted to have you as a customer.
            <br/><br/>
            Here are some of our services:
            <ul>
                <li>
                    Vehicle services such as Auto Repair, Car Wash & Body Shop services which can include: 
                    <li>
                        Oil Change, Brake Repair, Engine Repair, Diagnostic Scan & Electrical, 
                        AC Repair & Regas, Alignment & Camber, Buff & Polish, Complete Wash, 
                        Shampoo Upholstery, Engine / Under Wash, Microfine, Repaint/Touch-Up, 
                        Polish Headlights, Repair Dents / Accidents, Ceramic Coating, Rim Repair, 
                        and so on
                    </li>
                </li>
                <li>Vehicle rental</li>
                <li>Buy Vehicle parts & accesories</li>
            </ul>
            <br/><br/>
            To know more about our services:
            <a href="${process.env.ORIGIN_URL}/login" 
                style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;"
            >
                Explore
            </a>
            <br/><br/>
            Warm Regards, 
            Mega-Automotives Team.
        `,
    })
}

const sendNewBookingMail = async (user, savedBooking) => {
    return await sendEmail({
        to: user.email,
        subject: `Your Vehicle ${savedBooking.assignedToModel} has been booked`,
        html: `<h3>Hello, ${user.name.firstName}</h3>
            <br/>
            Thank you for booking with Mega-Automotives.
            <br/>
            Your vehicle ${savedBooking.assignedToModel} has been booked successfully.
            You will recieve a notification from us via your account and mail,
            in the next few hours once the booking has been confirmed.
            <br/><br/>
            <a href="${process.env.ORIGIN_URL}/bookings/${savedBooking._id}" 
                style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;"
            >
                Check Booking
            </a>
            <br/><br/>
            If you would like to cancel your booking, click 
            <a href="${process.env.ORIGIN_URL}/bookings/${savedBooking._id}">here</a>.
            Please note that your booking can only be cancelled 
            prior to the drop-off/pick-up of the vehicle.
            <br/><br/>
            Warm Regards,
            <br/>
            Mega-Automotives Team.
        `,
    })
}

const sendBookingStatusMail = async (updatedBooking) => {
    return await sendEmail({
        to: updatedBooking.owner.email,
        subject: `Your Vehicle ${updatedBooking.assignedToModel} booking is now ${updatedBooking.status}`,
        html: `<h3>Dear ${updatedBooking.owner.name.firstName},</h3>
            <br/>
            Thank you for booking with Mega-Automotives.
            <br/>
            Your vehicle ${updatedBooking.assignedToModel} booking record is now ${updatedBooking.status}.
            <br/><br/>
            <a href="${process.env.ORIGIN_URL}/bookings/${updatedBooking._id}" 
                style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;"
            >
                Check Booking
            </a>
            <br/><br/>
            If you would like to cancel your booking, click 
            <a href="${process.env.ORIGIN_URL}/bookings/${updatedBooking._id}">here</a>.
            Please note that your booking can only be cancelled 
            prior to the drop-off/pick-up of the vehicle.
            <br/><br/>
            Happy Booking.
            <br/><br/>
            Warm Regards,
            <br/>
            Mega-Automotives Team.
        `,
    })
}

const sendPaymentVerificationMail = async (email, savedPayment) => {
    return await sendEmail({
        to: email,
        subject: `${savedPayment.assignedToModel} order payment ${savedPayment.status}`,
        html: `<h3>Dear valued user,</h3>
            <br/>
            Thank you for placing your order with Mega-Automotives.
            <br/>
            Your ${savedPayment.assignedToModel} order payment was successful.
            <br/><br/>
            <a href="${process.env.ORIGIN_URL}/bookings/${savedPayment._id}" 
                style="margin:auto;background:#4f5ddb;color:#fff;padding:4px;font-size:16px;border-radius:5px;"
            >
                View Payment
            </a>
            <br/><br/>
            If you would like to place a complaint, click 
            <a href="mailto:${process.env.EMAIL_FROM}">here</a>.
            Please note that your payment can only be cancelled 
            prior to the pick-up of the order.
            <br/><br/>
            <br/><br/>
            Warm Regards,
            <br/>
            Mega-Automotives Team.
        `,
    })
}

export default {
    sendWelcomeMailFromAdmin,
    sendWelcomeMail,
    sendForgotPasswordMail,
    sendEmailVerificationMail,
    sendNewBookingMail,
    sendBookingStatusMail,
    sendPaymentVerificationMail,
}
