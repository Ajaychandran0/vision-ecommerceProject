
const productServices = require('../services/product_collection');
const cartServices = require('../services/cart_collection')

module.exports = {

    home: async (req, res) => {
        
        let products = await productServices.getAllProducts()
        let cartCount=0
        
        if(req.session.user){

            let cart = await cartServices.getCartByuserId(req.session.user._id)
            cartCount = cart.products.length
            req.session.cartCount=cartCount
        }
        
        res.render('shop/home', { products,cartCount });


    },

    about: (req, res) => {
        res.render('shop/about')
    },

    contact: (req, res) => {
        res.render('shop/contact')
    },

    men: (req, res) => {
        res.render('shop/men')
    },

    product: (req, res) => {
        productServices.getProductById(req.params.id).then((product) => {
            res.render('shop/product-detail', { product })
        })
    },

    women: (req, res) => {
        res.render('shop/women')
    },





}
