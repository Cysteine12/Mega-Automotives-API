import nodemailer from 'nodemailer'

const sendEmail = (mail) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: `Mega-Automotives ${process.env.EMAIL_FROM}`,
        to: mail.to,
        subject: mail.subject,
        html: `
            <div style="background:#e2d8d8; padding: 20px 10px;">
                <div style="background: #fff; border-radius: 10px; padding: 10px 10px;">
                    ${mail.html}
                </div>
            </div>
        `,
    }

    return transporter.sendMail(mailOptions)
}

export default sendEmail
