const express = require('express')
const router = express.Router()
const adminController = require('../contollers/admin_controller')
const authController = require('../contollers/auth_controller')
const { verifyAdminLogin, verifyAdminNotLogin } = require('../middlewares/authentication')

/* GET home page. */
router.get('/', verifyAdminLogin, adminController.getAdminDashboard)
router.get('/login', verifyAdminNotLogin, adminController.getAdminLogin)
router.post('/login', authController.logAdminIn)
router.get('/logout', adminController.logAdminOut)

// user management

router.get('/users', verifyAdminLogin, adminController.userManagement)
router.patch('/block-user/:id', verifyAdminLogin, adminController.blockUser)
router.patch('/unblock-user/:id', verifyAdminLogin, adminController.unblockUser)

// product management

router.get('/products', verifyAdminLogin, adminController.productManagement)
router.get('/add-product', verifyAdminLogin, adminController.getAddProduct)
router.post('/add-product', verifyAdminLogin, adminController.postAddProduct)
router.get('/edit-product/:id', verifyAdminLogin, adminController.getEditProduct)
router.post('/edit-product/:id', verifyAdminLogin, adminController.editProduct)
router.get('/delete-product/:id', verifyAdminLogin, adminController.deleteProduct)

// categories management

router.get('/category', verifyAdminLogin, adminController.getCategory)
router.post('/add-category', verifyAdminLogin, adminController.addCategory)
router.delete('/delete-category/:id', verifyAdminLogin, adminController.deleteCategory)

// order management

router.get('/order', verifyAdminLogin, adminController.getOrderManagement)
router.patch('/change-order-status', verifyAdminLogin, adminController.changeOrderStatus)

// offer management

router.get('/offers', verifyAdminLogin, adminController.getOfferManagement)
router.post('/offers/category-offer', verifyAdminLogin, adminController.addCategoryOffer)
router.delete('/offers/product-offer', verifyAdminLogin, adminController.deleteProductOffer)
router.post('/offers/product-offer', verifyAdminLogin, adminController.addProductOffer)
router.delete('/offers/category-offer', verifyAdminLogin, adminController.deleteCategoryOffer)

// coupon management

router.get('/coupons', verifyAdminLogin, adminController.getCouponManagement)
router.post('/coupons', verifyAdminLogin, adminController.postCouponManagement)
router.delete('/coupon', verifyAdminLogin, adminController.deleteCoupon)

module.exports = router
