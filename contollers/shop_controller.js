
const productServices = require('../services/product_collection')
const cartServices = require('../services/cart_collection')
const categoryServices = require('../services/category_collection')

module.exports = {

  home: async (req, res) => {
    const products = await productServices.getAllProducts()
    const categories = await categoryServices.getAllCategories()
    let cartCount = 0

    req.session.categories = categories

    if (req.session.user) {
      const cart = await cartServices.getCartByuserId(req.session.user._id)
      if (cart) {
        cartCount = cart.products.length
        req.session.cartCount = cartCount
      }
    }

    res.render('shop/home', {
      products,
      categories,
      cartCount
    })
  },

  contact: (req, res) => {
    res.render('shop/contact')
  },

  product: (req, res) => {
    productServices.getProductById(req.params.id).then((product) => {
      if (product) {
        res.render('shop/product-detail', { product })
      } else {
        console.log('no product found')
        res.status(404).render('errors/404_error')
      }
    }).catch(err => {
      console.log(err)
      res.status(404).render('errors/404_error')
    })
  },

  filterByCategory: async (req, res) => {
    const category = await categoryServices.getCategoryById(req.params.id)
    console.log(category)
    const products = await productServices.getProductByCategory(category)
    console.log(products)
    res.render('shop/category', { products })
  }

}
