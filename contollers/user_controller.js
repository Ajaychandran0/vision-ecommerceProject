
const userHelpers = require('../helpers/user_helper')
const addressServices = require('../services/address_collection')



module.exports = {

  getSignup: (req, res) => {
    res.render('user/signup', {
      errorMessage: req.flash('error'),
      layout: './layouts/plain'
    });
  },

  signupUser: (req, res) => {

    userHelpers.doSignup(req.body).then((signUpFailed) => {
      if (signUpFailed == true) {

        req.flash('error', 'User already exists')
        res.redirect('/signup')

      } else {
        res.redirect('/login')
      }
    })
  },

  getLogin: (req, res) => {

    res.render('user/login',
      {
        errorMessage: req.flash('error'),
        layout: './layouts/plain'
      })
  },

  loginUser: (req, res) => {

    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.isLoggedIn = true
        req.session.user = response.user

        res.redirect('/')
      } else {
        req.flash('error', 'Invalid email or password')
        res.redirect('/login')
      }
    })
  },

  getOtpLogin: (req, res) => {
    res.render('user/otp-login', {

      errorMessage: req.flash('error'),
      layout: './layouts/plain'

    });
  },

  getAccountDetails: async (req, res) => {

    let userId = req.session.user._id
    let addresses = await addressServices.getAddressesByUserId(userId)
    console.log(addresses);
    if (addresses) addresses = addresses.addresses
    else addresses = []
    console.log(addresses)
    res.render('user/account', { addresses })

  },


  addAddress: async (req, res, next) => {

    let userId = req.session.user._id
    let address = req.body
    let userAddresses = await addressServices.getAddressesByUserId(userId)

    if (userAddresses) {
      await addressServices.pushNewAddress(userId, address)

    } else {

      await addressServices.addAddressByUserId(userId, address)
    }

    if(req.params.num==1){
      res.redirect('/account')
    }else if(req.params.num==2){
      res.redirect('/checkout')
    }else{
      res.status(404).render('errors/404-error')
    }
  },

  getEditAddress: async (req, res) => {

    let addressId = req.body.addressId
    console.log(addressId)
    userId = req.session.user._id
    let address = await addressServices.getAddressByAddressId(userId, addressId)
    res.json(address)


  },

  postEditAddress: (req, res) => {

    let address = req.body
    let addressId = req.params.id
    let userId = req.session.user._id

    addressServices.updateUserAddress(userId, addressId, address).then((response) => {
      res.json({ status: true })
    })

  },

  deleteAddress:(req,res)=>{

    let addressId = req.body.addressId
    let userId = req.session.user._id
    addressServices.deleteAddressById(userId,addressId).then(()=>{
      res.json({deleteAddress:true})
    })

  },

  wishlist: (req, res) => {
    res.render('user/add-to-wishlist');
  },


  orderComplete: (req, res) => {
    res.render('user/order-complete');
  },
  orderDetails: (req, res) => {
    res.render('user/orders')
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      console.log(err)
      res.redirect('/login')
    })
  }


}