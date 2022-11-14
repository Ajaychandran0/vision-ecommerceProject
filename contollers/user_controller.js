
const userHelpers = require('../helpers/user_helper')


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

  checkout: (req, res) => {
    res.render('user/checkout');
  },

  orderComplete: (req, res) => {
    res.render('user/order-complete');
  },

  wishlist: (req, res) => {
    res.render('user/add-to-wishlist');
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      console.log(err)
      res.redirect('/login')
    })
  }

}