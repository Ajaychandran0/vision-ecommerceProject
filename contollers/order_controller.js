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
    totalPrice = await cartServices.getTotalPrice(userId)
    const address = await addressServices.getAddressByAddressId(userId, orderDetails.address)
    const orderStatus = orderDetails.paymentMethod === 'COD' ? 'placed' : 'pending'

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

    orderServices.placeOrdeByUserId(userId, order).then(async (orderId) => {
      console.log(orderId)

      await cartServices.deleteCartByUserId(userId)
      req.session.cartCount = 0

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
        const price = totalPrice * 0.01

        console.log('hey inside else if of method paypal')

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
            console.log('in paypal creare payment just before for loop')
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
    const price = totalPrice * 0.01
    const payerId = req.query.PayerID
    console.log(payerId, 'this is payer id')
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
        res.redirect('/order-complete')
      }
    })
  },

  cancelOrder: async (req, res) => {
    const orderId = req.body.orderId
    const proId = req.body.proId

    await orderServices.cancelOrderItem(orderId, proId)
    res.json(true)
  },

  verifyPayment: (req, res) => {
    try {
      const paymentDetails = req.body
      console.log('its paymetn detsis checking console cimming nest')
      console.log(paymentDetails)

      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)

      console.log('jldfjdlfjlsdfjsdlflsdjf requitre')

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
  }
}
