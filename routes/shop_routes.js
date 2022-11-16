const express = require('express');
const router = express.Router();
const shopController = require('../contollers/shop_controller')
const userController = require('../contollers/user_controller')
const {verifyUserLogin,verifyUserNotLogin} =require('../middlewares/authentication')
const signupValidation= require('../middlewares/validation')




/* GET shop listing. */

router.get('/',shopController.home);
router.get('/about',shopController.about)
router.get('/contact',shopController.contact)
router.get('/men',shopController.men)
router.get('/product/:id',shopController.product)
router.get('/women',shopController.women)


/* GET user related listing. */

router.get('/login',verifyUserNotLogin, userController.getLogin);
router.post('/login',userController.loginUser)

router.get('/signup',verifyUserNotLogin, userController.getSignup);
router.post('/signup',signupValidation, userController.signupUser);

router.get('/otp-login',verifyUserNotLogin, userController.otpLogin);

router.get('/checkout',verifyUserLogin, userController.checkout);
router.get('/order-complete',verifyUserLogin, userController.orderComplete);

router.get('/cart',verifyUserLogin, userController.cart)
router.get('/add-to-cart/:id',verifyUserLogin, userController.addToCart)

router.get('/wishlist',verifyUserLogin, userController.wishlist);
router.get('/logout',userController.logout)





module.exports = router;
