/* eslint-disable eqeqeq */
const cartServices = require('../services/cart_collection')
const addressServices = require('../services/address_collection')
const couponServices = require('../services/coupon_collection')

module.exports = {

  getCart: async (req, res) => {
    const userId = req.session.user._id
    const cartItems = await cartServices.getCartItems(userId)
    const couponInfo = await couponServices.getAllCoupons()
    let couponDiscount = req.session.couponDiscount
    let couponCode = req.session.couponCode
    if (!couponCode) {
      couponCode = null
      req.session.couponCode = null
      couponDiscount = 0
      req.session.couponDiscount = 0
    }

    let subTotal = 0
    for (let i = 0; i < cartItems.length; i++) {
      subTotal += cartItems[i].total
    }

    res.render('user/cart', { cartItems, subTotal, couponInfo, couponDiscount, couponCode })
  },

  addToCart: async (req, res) => {
    const userId = req.session.user._id
    const proId = req.params.id
    const userCart = await cartServices.getCartByuserId(userId)

    req.session.couponDiscount = 0
    req.session.couponCode = null

    if (userCart) {
      const productExist = userCart.products.findIndex(product => product.item == proId)

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

    req.session.couponCode = null
    req.session.couponDiscount = 0
    let response

    if (count === -1 && quantity === 1) {
      response = await cartServices.removeProductFromCart(cartId, proId)
      req.session.cartCount += count
    } else {
      response = await cartServices.incProductQuantity(cartId, proId, count)
    }
    const subTotal = await cartServices.getTotalPrice(userId)

    response.subTotal = subTotal
    res.json(response)
  },

  removeProduct: async (req, res) => {
    const response = await cartServices.removeProductFromCart(req.body.cartId, req.body.proId)
    req.session.cartCount -= 1
    req.session.couponCode = null
    req.session.couponDiscount = 0
    res.json(response)
  },

  checkout: async (req, res) => {
    if (req.session.cartCount === 0) {
      return res.redirect('/cart')
    }

    const userId = req.session.user._id
    let subTotal = await cartServices.getTotalPrice(userId)
    const couponDiscount = req.session.couponDiscount

    if (couponDiscount) {
      subTotal -= couponDiscount
    }
    let addresses = await addressServices.getAddressesByUserId(userId)
    if (addresses) addresses = addresses.addresses
    else addresses = []

    res.render('user/checkout', { subTotal, addresses })
  },

  applyCoupon: async (req, res) => {
    const couponCode = req.body.coupon
    const userId = req.session.user._id

    let totalPrice = await cartServices.getTotalPrice(userId)
    const user = await couponServices.checkUserClaimed(userId, couponCode)
    const activeCoupon = await couponServices.checkCouponExpired(couponCode)

    if (activeCoupon !== null && !user) {
      if (totalPrice >= activeCoupon.minimumPrice) {
        const discount = (activeCoupon.percentage * totalPrice) / 100

        totalPrice = (totalPrice - discount)
        req.session.couponDiscount = discount
        req.session.couponCode = couponCode
        req.session.couponPercentage = activeCoupon.percentage

        res.json({ totalPrice, discount, couponCode })
      } else {
        const errMsg = 'The coupon is only applicable for products above ₹' + activeCoupon.minimumPrice
        res.json({ message: errMsg })
      }
    } else {
      const errMsg = 'Coupon does not exist or expired'
      res.json({ message: errMsg })
    }
  }

}
