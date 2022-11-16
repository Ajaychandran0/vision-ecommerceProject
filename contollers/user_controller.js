
const userHelpers = require('../helpers/user_helper')
const userServices = require('../services/user_collection')
const cartServices = require('../services/cart_collection')


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

  otpLogin: (req, res) => {
    res.render('user/otp-login', { layout: './layouts/plain' });
  },

  wishlist: (req, res) => {
    res.render('user/add-to-wishlist');
  },

  // cart controll

  cart: async(req, res) => {
    let userId = req.session.user._id
    let cartItems = await cartServices.getCartItems(userId)
    res.render('user/cart',{cartItems})
  },

  addToCart: async (req, res) => {
  
    let userId = req.session.user._id
    let proId = req.params.id
    let userCart = await cartServices.getCartByuserId(userId)

    if (userCart) {
      let productExist = userCart.products.findIndex(product => product.item == proId)
  
      if (productExist != -1) {

        cartServices.incProductQuantity(proId).then(()=>{
          res.json({status:true})
          req.session.cartCount += 1;
        })

      } else {
        cartServices.pushProductToCart(proId, userId).then(() => {
          res.json({status:true})
          req.session.cartCount += 1;
        })
      }
    } else {
      cartServices.createCartByUserId(proId, userId).then(() => {
        res.json({status:true})
        req.session.cartCount += 1;
      })
    }
    
  },

  checkout: (req, res) => {
    res.render('user/checkout');
  },

  orderComplete: (req, res) => {
    res.render('user/order-complete');
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      console.log(err)
      res.redirect('/login')
    })
  }

}