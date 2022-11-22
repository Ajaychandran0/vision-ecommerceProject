const cartServices = require('../services/cart_collection');



module.exports = {


    getCart: async (req, res) => {

        let userId = req.session.user._id
        let cartItems = await cartServices.getCartItems(userId)

        let subTotal = 0
        console.log(cartItems)
        for (i = 0; i < cartItems.length; i++) {
            subTotal += cartItems[i].total
        }

        res.render('user/cart', { cartItems, subTotal })
    },



    addToCart: async (req, res) => {

     

        let userId = req.session.user._id
        let proId = req.params.id
        let userCart = await cartServices.getCartByuserId(userId)

        if (userCart) {
            let productExist = userCart.products.findIndex(product => product.item == proId)

            if (productExist != -1) {

                let cartId = userCart._id
                await cartServices.incProductQuantity(cartId, proId)
                res.json({ status: false })

            } else {

                await cartServices.pushProductToCart(proId, userId)
                req.session.cartCount += 1;
                res.json({ status: true })

            }
        } else {

            await cartServices.createCartByUserId(proId, userId)
            req.session.cartCount += 1;
            res.json({ status: true })

        }
    },



    changeCartProductQuantity: async (req, res) => {

        let cartId = req.body.cart
        let proId = req.body.product
        let userId = req.session.user._id
        let count = parseInt(req.body.count)
        let quantity = parseInt(req.body.quantity)
        let response

        if (count == -1 && quantity == 1) {

            response = await cartServices.removeProductFromCart(cartId, proId)
            req.session.cartCount += count;

        } else {

            response = await cartServices.incProductQuantity(cartId, proId, count)

        }
        let subTotal = await cartServices.getTotalPrice(userId)        
        
        response.subTotal = subTotal        
        res.json(response)

    },



    removeProduct:async(req,res)=>{

        let response = await cartServices.removeProductFromCart(req.body.cartId,req.body.proId)
        req.session.cartCount -= 1 
        res.json(response)      

    },



    checkout: async (req, res) => {

        let userId = req.session.user._id
        let Total = await cartServices.getTotalPrice(userId)
        let subTotal = Total[0].total
        
        res.render('user/checkout', { subTotal });
      }

}