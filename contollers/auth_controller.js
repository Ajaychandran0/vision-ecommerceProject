/* eslint-disable camelcase */
/* eslint-disable padded-blocks */

require('dotenv').config()
const userServices = require('../services/user_collection')
const adminServices = require('../services/admin_collection')
const bcrypt = require('bcrypt')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_ID
const client = require('twilio')(accountSid, authToken)

module.exports = {

  // admin login

  logAdminIn: async (req, res) => {
    const adminData = req.body
    let loginStatus = false
    const admin = await adminServices.checkAdminExist(adminData.email)

    if (admin) {
      await bcrypt.compare(adminData.password, admin.password).then((status) => {
        if (status) {
          console.log('login successfull')
          req.session.loggedAdminIn = true
          req.session.admin = admin
          loginStatus = true
        } else { console.log('login failed due to wrong password') }
      })

    } else { console.log('login failed no user') }

    if (loginStatus) {

      res.redirect('/admin')
    } else {
      req.flash('error', 'Invalid email or password')
      res.redirect('/admin/login')
    }

  },

  // user login

  loginUser: async (req, res) => {

    const password = req.body.password
    const email = req.body.email_username
    const username = req.body.email_username
    let loginStatus = false

    const user = await userServices.checkUserExist(email, username)

    if (user) {
      const active = user.isActive
      if (active) {

        await bcrypt.compare(password, user.password).then((status) => {
          if (status) {

            console.log('login successfull')
            req.session.isLoggedIn = true
            req.session.user = user

            loginStatus = true

          } else { console.log('login failed invalid password') }
        })

      } else { console.log('login failed admin blocked you') }

    } else { console.log('login failed no user') }

    if (loginStatus) {
      res.redirect('/')
    } else {
      req.flash('error', 'Invalid email or password')
      res.redirect('/login')
    }
  },

  // otp login

  sendOtp: (req, res) => {

    const { mobileNumber } = req.body
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

    const { mobileNumber, code } = req.body

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

    const user = await userServices.checKUserPhoneNoExist(phone)
    console.log(user)
    if (user) {
      const active = user.isActive
      if (active) {

        req.session.isLoggedIn = true
        req.session.user = user
        res.json({ userLogin: true })
        console.log('login successful')

      } else {
        console.log('your account was block')
        req.flash('error', 'your account has been blocked')
        res.json({ userLogin: false })
      }
    } else {
      console.log('hey i am in no account')
      req.flash('error', 'No account with this phone number')
      res.json({ userNotFound: true })

    }

  }
}
