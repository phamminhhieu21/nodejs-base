const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"hieudeptrai" <no-relply@hieupm2k20@gmail.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        html: html, // html body
    }
    , (err, info) => {
        if (err) {
            console.log('Error in sending mail', err)
        } else {
            console.log('Email sent: ' + info.response);
            // return false;
        }
    }
    );

    return info
})

module.exports = sendMail