var express = require('express');
var router = express.Router();
var userController = require('../contollers/user')


//verify login middleware
const verifyLogin = (req,res,next)=>{
  if(!req.session.isLoggedIn)
  next()
  else
  res.redirect("/")
}

  
  router.get('/login',verifyLogin,userController.getLogin);
  router.post('/login',userController.loginUser)

  
  router.get('/signup',verifyLogin,userController.getSignup);
  router.post('/signup',userController.SignupUser);

  
  router.get('/otp-login',verifyLogin,userController.otpLogin);

  router.get('/checkout',userController.checkout);

  router.get('/order-complete',userController.orderComplete);

  router.get('/wishlist',userController.wishlist);

  router.get('/logout',userController.logout)



  module.exports = router;