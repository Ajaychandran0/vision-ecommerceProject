const express = require('express')
const router = express.Router()

const { verifyUserLogin, verifyUserNotLogin } = require('../middlewares/authentication')
const shopController = require('../contollers/shop_controller')
const userController = require('../contollers/user_controller')
const cartController = require('../contollers/cart_controller')
const signupValidation = require('../middlewares/validation')
const authController = require('../contollers/auth_controller')
const orderController = require('../contollers/order_controller')

/* GET shop listing. */

router.get('/', shopController.home)
router.get('/contact', shopController.contact)
router.get('/product/:id', shopController.product)
router.get('/category/:id', shopController.filterByCategory)

// autocomplete search
router.get('/autocomplete-search', shopController.getSearchAutoComplete)
router.get('/filter-products', shopController.filterProductsOnSearch)

/* GET user related listing. */

router.get('/login', verifyUserNotLogin, userController.getLogin)
router.post('/login', authController.loginUser)

router.get('/signup', verifyUserNotLogin, userController.getSignup)
router.post('/signup', signupValidation, userController.signupUser)

// otp login
router.get('/otp-login', verifyUserNotLogin, userController.getOtpLogin)
router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOTP)
router.post('/otp-login', authController.postOtpLogin)

// user account
router.get('/account', verifyUserLogin, userController.getAccountDetails)
router.post('/add-address/:num', verifyUserLogin, userController.addAddress)
router.post('/edit-address', verifyUserLogin, userController.getEditAddress)
router.post('/edit-address-post/:id', verifyUserLogin, userController.postEditAddress)
router.delete('/delete-address', verifyUserLogin, userController.deleteAddress)

// cart routes
router.get('/cart', verifyUserLogin, cartController.getCart)
router.get('/add-to-cart/:id', verifyUserLogin, cartController.addToCart)
router.post('/cart/change-product-quantity', verifyUserLogin, cartController.changeCartProductQuantity)
router.post('/cart/removeProduct', verifyUserLogin, cartController.removeProduct)

// coupons
router.post('/redeemCoupon', verifyUserLogin, cartController.applyCoupon)

// checkout
router.get('/checkout', verifyUserLogin, cartController.checkout)
router.post('/place-order', verifyUserLogin, orderController.placeOrder)
router.get('/success', verifyUserLogin, orderController.paypalSuccess)
router.post('/verify-payment', verifyUserLogin, orderController.razorpayVerifyPayment)
router.get('/order-complete', verifyUserLogin, userController.orderComplete)

// order
router.get('/orders', verifyUserLogin, userController.orderDetails)
router.delete('/cancel-order', verifyUserLogin, orderController.cancelOrder)
router.patch('/return-order', verifyUserLogin, orderController.returnOder)

router.get('/wishlist', verifyUserLogin, userController.wishlist)
router.get('/logout', userController.logout)

module.exports = router
