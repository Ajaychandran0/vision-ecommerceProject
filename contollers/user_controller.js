/* eslint-disable eqeqeq */
const addressServices = require('../services/address_collection')
const orderServices = require('../services/order_collection')
const userServices = require('../services/user_collection')
const bcrypt = require('bcrypt')

module.exports = {

  getSignup: (req, res) => {
    res.render('user/signup', {
      errorMessage: req.flash('error'),
      layout: './layouts/plain'
    })
  },

  signupUser: async (req, res) => {
    const userData = req.body
    const user = await userServices.checkUserExist(userData.email, userData.username)

    if (user) {
      req.flash('error', 'User already exists')
      res.redirect('/signup')
    } else {
      userData.password = await bcrypt.hash(userData.password, 10)
      console.log('user added successfully')
      userData.isActive = true

      await userServices.createUser(userData)
      res.redirect('/login')
    }
  },

  getLogin: (req, res) => {
    res.render('user/login',
      {
        errorMessage: req.flash('error'),
        layout: './layouts/plain'
      })
  },

  getOtpLogin: (req, res) => {
    res.render('user/otp-login', {

      errorMessage: req.flash('error'),
      layout: './layouts/plain'

    })
  },

  getAccountDetails: async (req, res) => {
    const userId = req.session.user._id
    let addresses = await addressServices.getAddressesByUserId(userId)
    console.log(addresses)
    if (addresses) addresses = addresses.addresses
    else addresses = []
    console.log(addresses)
    res.render('user/account', { addresses })
  },

  addAddress: async (req, res, next) => {
    const userId = req.session.user._id
    const address = req.body
    const userAddresses = await addressServices.getAddressesByUserId(userId)

    if (userAddresses) {
      await addressServices.pushNewAddress(userId, address)
    } else {
      await addressServices.addAddressByUserId(userId, address)
    }

    if (req.params.num == 1) {
      res.redirect('/account')
    } else if (req.params.num == 2) {
      res.redirect('/checkout')
    } else {
      res.status(404).render('errors/404_error')
    }
  },

  getEditAddress: async (req, res) => {
    const addressId = req.body.addressId
    console.log(addressId)
    const userId = req.session.user._id
    const address = await addressServices.getAddressByAddressId(userId, addressId)
    res.json(address)
  },

  postEditAddress: (req, res) => {
    const address = req.body
    const addressId = req.params.id
    const userId = req.session.user._id

    addressServices.updateUserAddress(userId, addressId, address).then((response) => {
      res.json({ status: true })
    })
  },

  deleteAddress: (req, res) => {
    const addressId = req.body.addressId
    const userId = req.session.user._id
    addressServices.deleteAddressById(userId, addressId).then(() => {
      res.json({ deleteAddress: true })
    })
  },

  wishlist: (req, res) => {
    res.render('user/add-to-wishlist')
  },

  orderComplete: (req, res) => {
    res.render('user/order-complete')
  },

  orderDetails: async (req, res) => {
    const userId = req.session.user._id
    const orders = await orderServices.getUserOrders(userId)

    res.render('user/orders', { orders })
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      console.log(err)
      res.redirect('/login')
    })
  }

}
