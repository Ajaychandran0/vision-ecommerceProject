const cartServices = require('../services/cart_collection')
const orderServices = require('../services/order_collection')
const addressServices = require('../services/address_collection')

const Razorpay = require('razorpay')
const paypal = require('paypal-rest-sdk')

const instance = new Razorpay(
  {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })

paypal.configure({
  mode: 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
})

let totalPrice

module.exports = {

  placeOrder: async (req, res) => {
    const orderDetails = req.body
    const userId = req.session.user._id
    const cartItems = await cartServices.getCartItems(userId)
    const address = await addressServices.getAddressByAddressId(userId, orderDetails.address)
    const orderStatus = orderDetails.paymentMethod === 'COD' ? 'placed' : 'pending'
    totalPrice = await cartServices.getTotalPrice(userId)

    const couponDiscount = req.session.couponDiscount
    if (couponDiscount) {
      totalPrice -= couponDiscount
    }
    totalPrice = Math.round(((totalPrice) + Number.EPSILON) * 100) / 100

    for (const item of cartItems) {
      item.itemStatus = 'placed'
      item.proId = item.product._id
    }

    const order = {
      deliveryDetails: address,
      paymentMehod: orderDetails.paymentMethod,
      orderItems: cartItems,
      totalPrice,
      status: orderStatus

    }

    if (couponDiscount) {
      order.couponCode = req.session.couponCode
      order.couponPercentage = req.session.couponPercentage
    }

    orderServices.placeOrdeByUserId(userId, order).then(async (orderId) => {
      console.log(orderId)

      await cartServices.deleteCartByUserId(userId)
      req.session.cartCount = 0
      req.session.couponCode = null
      req.session.couponDiscount = 0

      if (orderDetails.paymentMethod === 'COD') {
        res.json({ orderPlaced: true })
      } else if (orderDetails.paymentMethod === 'RAZORPAY') {
        const options = {
          amount: totalPrice * 100,
          currency: 'INR',
          receipt: orderId
        }

        instance.orders.create(options, (_err, order) => {
          console.log('new order:', order)
          res.json({ order, razorpay: true })
        })
      } else if (orderDetails.paymentMethod === 'PAYPAL') {
        req.session.orderId = orderId

        const price = Math.round(((totalPrice * 0.01) + Number.EPSILON) * 100) / 100

        // eslint-disable-next-line camelcase
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal'
          },
          redirect_urls: {
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/paypal-cancel'
          },
          transactions: [{
            item_list: {
              items: [{
                name: 'item',
                sku: 'item',
                price,
                currency: 'USD',
                quantity: 1
              }]
            },
            amount: {
              currency: 'USD',
              total: price
            },
            description: 'This payment is done through paypal'
          }]
        }

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            console.log(error)
            throw error
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.json({ url: payment.links[i].href, paypal: true })
              }
            }
          }
        })
      }
    })
  },

  paypalSuccess: (req, res) => {
    const price = Math.round(((totalPrice * 0.01) + Number.EPSILON) * 100) / 100
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId

    // eslint-disable-next-line camelcase
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: price
        }
      }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log(JSON.stringify(payment))
        orderServices.changePaymentStatus(req.session.orderId).then(() => {
          res.redirect('/order-complete')
        })
      }
    })
  },

  razorpayVerifyPayment: (req, res) => {
    try {
      const paymentDetails = req.body
      console.log(paymentDetails)

      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)

      hmac.update(paymentDetails['payment[razorpay_order_id]'] + '|' + paymentDetails['payment[razorpay_payment_id]'])
      hmac = hmac.digest('hex')

      if (hmac === paymentDetails['payment[razorpay_signature]']) {
        orderServices.changePaymentStatus(paymentDetails['order[receipt]']).then(() => {
          console.log('payment successfull')
          res.json({ status: true })
        })
      } else {
        res.json({ status: false })
      }
    } catch (e) { console.log(e) }
  },

  cancelOrder: async (req, res) => {
    const orderId = req.body.orderId
    const proId = req.body.proId

    await orderServices.cancelOrderItem(orderId, proId)
    res.json(true)
  },

  returnOder: async (req, res) => {
    const orderId = req.body.orderId
    const proId = req.body.proId

    await orderServices.changeOrderItemStatus(orderId, proId, 'return')
    res.json(true)
  }
}
