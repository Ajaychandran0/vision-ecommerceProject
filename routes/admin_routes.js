const express = require('express')
const router = express.Router()
const adminController = require('../contollers/admin_controller')
const authController = require('../contollers/auth_controller')
const { verifyAdminLogin, verifyAdminNotLogin } = require('../middlewares/authentication')
const { upload } = require('../utils/multer')
const { imgs } = require('../utils/multer')

/* GET Admin Dashboard */
router.get('/', verifyAdminLogin, adminController.getAdminDashboard)
router.get('/dashboard/category-chart', verifyAdminLogin, adminController.getCategoryChart)
router.get('/dashboard/paymentmethod-chart', verifyAdminLogin, adminController.getPaymentMethodChart)
router.get('/dashboard/orderstatus-chart', verifyAdminLogin, adminController.getOrderStatusChart)

// admin login & logout
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
router.post('/add-product', verifyAdminLogin, upload.fields(imgs), adminController.postAddProduct)

router.get('/edit-product/:id', verifyAdminLogin, adminController.getEditProduct)
router.post('/edit-product/:id', verifyAdminLogin, upload.fields(imgs), adminController.editProduct)
router.post('/delete-product/:id', verifyAdminLogin, adminController.deleteProduct)

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
router.delete('/offers/category-offer', verifyAdminLogin, adminController.deleteCategoryOffer)
router.post('/offers/product-offer', verifyAdminLogin, adminController.addProductOffer)
router.delete('/offers/product-offer', verifyAdminLogin, adminController.deleteProductOffer)

// coupon management

router.get('/coupons', verifyAdminLogin, adminController.getCouponManagement)
router.post('/coupons', verifyAdminLogin, adminController.postCouponManagement)
router.delete('/coupon', verifyAdminLogin, adminController.deleteCoupon)

// sales report

router.get('/sales-report', verifyAdminLogin, adminController.getSalesReport)

module.exports = router
