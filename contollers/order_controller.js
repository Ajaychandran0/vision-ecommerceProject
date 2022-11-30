const cartServices = require('../services/cart_collection');
const orderServices = require('../services/order_collection');
const addressServices = require('../services/address_collection')



module.exports = {

    placeOrder: async (req, res) => {

        let orderDetails = req.body
        let userId = req.session.user._id
        let cartItems = await cartServices.getCartItems(userId)
        let totalPrice = await cartServices.getTotalPrice(userId)
        let address = await addressServices.getAddressByAddressId(userId, orderDetails.address)
        let orderStatus = orderDetails.paymentMethod === 'COD' ? 'placed' : 'pending'

        let order = {
            deliveryDetails: address,
            paymentMehod: orderDetails.paymentMethod,
            orderItems:cartItems,
            totalPrice: totalPrice,
            status: orderStatus

        }

        orderServices.placeOrdeByUserId(userId, order).then(async () => {

            if(orderStatus==='placed'){
            await cartServices.deleteCartByUserId(userId)
            req.session.cartCount = 0
            res.json({ orderPlaced: true })
            }else{
                res.json({orderPlaced:false})
            }
        })



    }
}
