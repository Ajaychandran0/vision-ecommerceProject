const cartServices = require('../services/cart_collection');
const orderServices = require('../services/order_collection');
const addressServices = require('../services/address_collection')

const Razorpay = require('razorpay')

let instance = new Razorpay(
    {
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })




module.exports = {

    placeOrder: async (req, res) => {

        let orderDetails = req.body
        let userId = req.session.user._id
        let cartItems = await cartServices.getCartItems(userId)
        let totalPrice = await cartServices.getTotalPrice(userId)
        let address = await addressServices.getAddressByAddressId(userId, orderDetails.address)
        let orderStatus = orderDetails.paymentMethod === 'COD' ? 'placed' : 'pending'

        for (let item of cartItems) {
            item.itemStatus = 'placed'
            item.proId = item.product._id
        }

        let order = {
            deliveryDetails: address,
            paymentMehod: orderDetails.paymentMethod,
            orderItems: cartItems,
            totalPrice: totalPrice,
            status: orderStatus

        }

        orderServices.placeOrdeByUserId(userId, order).then(async (orderId) => {
            console.log(orderId)

            await cartServices.deleteCartByUserId(userId)
            req.session.cartCount = 0

            if (orderDetails.paymentMethod === 'COD') {
                res.json({ orderPlaced: true })

            } else if (orderDetails.paymentMethod === 'RAZORPAY') {

                let options = {
                    amount: totalPrice,
                    currency: "INR",
                    receipt: orderId,
                }

                instance.orders.create(options, (err, order) => {
                    console.log('new order:', order)
                    res.json(order)
                })

            }
        })



    },


    cancelOrder: async (req, res) => {

        let orderId = req.body.orderId
        let proId = req.body.proId

        await orderServices.cancelOrderItem(orderId, proId)
        res.json(true)
    },

    verifyPayment: (req, res) => {
        try {

            paymentDetails = req.body
            console.log('its paymetn detsis checking console cimming nest')
            console.log(paymentDetails)

            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

            console.log('jldfjdlfjlsdfjsdlflsdjf requitre')

            hmac.update(paymentDetails['payment[razorpay_order_id]'] + '|' + paymentDetails['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')


            if (hmac == paymentDetails['payment[razorpay_signature]']) {

                orderServices.changePaymentStatus(paymentDetails['order[receipt]']).then(() => {

                    console.log('payment successfull')
                    res.json({ status: true })
                })
            } else {
                res.json({ status: false })
            }
        }
        catch (e) { console.log(e)}
    }
}
