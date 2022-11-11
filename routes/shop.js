var express = require('express');
var router = express.Router();
var shopController = require('../contollers/shop')




/* GET users listing. */
router.get('/',shopController.home);

router.get('/about',shopController.about)

router.get('/cart',shopController.cart)

router.get('/contact',shopController.contact)

router.get('/men',shopController.men)

router.get('/product/:id',shopController.product)

router.get('/women',shopController.women)








module.exports = router;
