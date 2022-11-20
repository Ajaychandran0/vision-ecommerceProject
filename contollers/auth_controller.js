
require('dotenv').config();
const userServices = require('../services/user_collection')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require('twilio')(accountSid, authToken);



module.exports = {

    sendOtp: (req, res) => {

        const { mobileNumber } = req.body;
        client.verify.v2.services(serviceId)
            .verifications
            .create({ to: '+91' + mobileNumber, channel: 'sms' })
            .then(verification => {

                return res.status(200).json({ verification })
            })
            .catch(error => {
                console.log(error)
                return res.status(400).json({ error })

            })
    },



    verifyOTP: (req, res) => {

        const { mobileNumber, code } = req.body;

        client.verify.v2.services(serviceId)
            .verificationChecks
            .create({ to: '+91' + mobileNumber, code })
            .then(verification_check => {
                console.log('succeddfully otp verified')

                return res.status(200).json({ verification_check })
            })
        .catch(error => {
            console.log('errorin catch is verified')

            return res.status(400).json({ error })
        })
    },


    postOtpLogin: async (req, res) => {

        const { mobileNumber } = req.body
        const phone = mobileNumber.toString()

        let user = await userServices.checKUserPhoneNoExist(phone)
        console.log(user)
        if (user) {
            let active = user.isActive
            if (active) {

                req.session.isLoggedIn = true
                req.session.user = user
                res.json({userLogin:true})
                console.log('login successful')

            } else {
                console.log('your account was block')
                req.flash('error', 'your account has been blocked')
                res.json({userLogin:false})
            }
        } else {
            console.log('hey i am in no account')
            req.flash('error', 'No account with this phone number')
            res.json({userNotFound:true})
            
        }

    }
}