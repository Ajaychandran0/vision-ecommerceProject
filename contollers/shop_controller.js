
const productServices = require('../services/product_collection');
const cartServices = require('../services/cart_collection')
const categoryServices = require('../services/category_collection')

module.exports = {

    home: async (req, res) => {

        let products = await productServices.getAllProducts()
        let categories = await categoryServices.getAllCategories()
        let cartCount = 0

        req.session.categories = categories

        if (req.session.user) {

            let cart = await cartServices.getCartByuserId(req.session.user._id)
            if (cart) {
                cartCount = cart.products.length
                req.session.cartCount = cartCount
            }
        }

        res.render('shop/home', { products,categories,cartCount });


    },

    about: (req, res) => {
        res.render('shop/about')
    },

    contact: (req, res) => {
        res.render('shop/contact')
    },
 

    product: (req, res) => {
        productServices.getProductById(req.params.id).then((product) => {
            res.render('shop/product-detail', { product })
        })
    },



    filterByCategory: async(req,res)=>{
       let category = await categoryServices.getCategoryById(req.params.id)
       console.log(category)
       let products = await productServices.getProductByCategory(category)
       console.log(products)
       res.render('shop/category',{products})
    }

    





}
