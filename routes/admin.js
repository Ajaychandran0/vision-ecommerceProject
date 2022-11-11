var express = require('express');
var router = express.Router();
var adminController = require('../contollers/admin_controller')

//verify login middleware
const verifyLogin = (req,res,next)=>{
    if(req.session.loggedAdminIn)
    next()
    else
    res.redirect("/admin/login")
}
const verifyNotLogin =(req,res,next)=>{
    if(!req.session.loggedAdminIn){
        next()
    }else{
        res.redirect('/admin')
    }
}


/* GET home page. */
router.get('/',verifyLogin,adminController.getAdminDashboard);
router.get('/login',verifyNotLogin,adminController.getAdminLogin)
router.post('/login',adminController.logAdminIn)
router.get('/logout',adminController.logAdminOut)

// user management

router.get('/users',verifyLogin,adminController.userManagement );
router.get('/block-user/:id',adminController.blockUser);
router.get('/unblock-user/:id',adminController.unblockUser)


// product management

router.get('/products',verifyLogin, adminController.productManagement);
router.get('/add-product',verifyLogin, adminController.getAddProduct);
router.post('/add-product',adminController.postAddProduct)
router.get('/edit-product/:id',verifyLogin,adminController.getEditProduct)
router.post('/edit-product/:id', adminController.editProduct)
router.get('/delete-product/:id',verifyLogin, adminController.deleteProduct)

// categories management

router.get('/category',verifyLogin, adminController.getCategory)
router.post('/add-category',adminController.addCategory)
router.get('/delete-category/:id',verifyLogin, adminController.deleteCategory)


module.exports = router;
