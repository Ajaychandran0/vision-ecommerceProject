const cartServices = require('../services/cart_collection')
const addressServices = require('../services/address_collection')

module.exports = {

  getCart: async (req, res) => {
    const userId = req.session.user._id
    const cartItems = await cartServices.getCartItems(userId)

    let subTotal = 0
    console.log(cartItems)
    for (let i = 0; i < cartItems.length; i++) {
      subTotal += cartItems[i].total
    }

    res.render('user/cart', { cartItems, subTotal })
  },

  addToCart: async (req, res) => {
    const userId = req.session.user._id
    const proId = req.params.id
    const userCart = await cartServices.getCartByuserId(userId)

    if (userCart) {
      const productExist = userCart.products.findIndex(product => product.item === proId)

      if (productExist !== -1) {
        const cartId = userCart._id
        await cartServices.incProductQuantity(cartId, proId)
        res.json({ status: false })
      } else {
        await cartServices.pushProductToCart(proId, userId)
        req.session.cartCount += 1
        res.json({ status: true })
      }
    } else {
      await cartServices.createCartByUserId(proId, userId)
      req.session.cartCount += 1
      res.json({ status: true })
    }
  },

  changeCartProductQuantity: async (req, res) => {
    const cartId = req.body.cart
    const proId = req.body.product
    const userId = req.session.user._id
    const count = parseInt(req.body.count)
    const quantity = parseInt(req.body.quantity)
    let response

    if (count === -1 && quantity === 1) {
      response = await cartServices.removeProductFromCart(cartId, proId)
      req.session.cartCount += count
    } else {
      response = await cartServices.incProductQuantity(cartId, proId, count)
    }
    const subTotal = await cartServices.getTotalPrice(userId)

    console.log('hey in sybtottal' + subTotal)

    response.subTotal = subTotal
    res.json(response)
  },

  removeProduct: async (req, res) => {
    const response = await cartServices.removeProductFromCart(req.body.cartId, req.body.proId)
    req.session.cartCount -= 1
    res.json(response)
  },

  checkout: async (req, res) => {
    if (req.session.cartCount === 0) {
      return res.redirect('/cart')
    }

    const userId = req.session.user._id
    const subTotal = await cartServices.getTotalPrice(userId)
    let addresses = await addressServices.getAddressesByUserId(userId)
    if (addresses) addresses = addresses.addresses
    else addresses = []

    res.render('user/checkout', { subTotal, addresses })
  }

}
