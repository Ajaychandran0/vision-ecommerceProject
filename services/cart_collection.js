const db = require('../models/connections')
const { CART_COLLECTION, PRODUCT_COLLETION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

    getCartByuserId: (userId) => {
        return new Promise((resolve, reject) => {

            db.get().collection(CART_COLLECTION).findOne({ user: objectId(userId) }).then((cart) => {
                resolve(cart)
            })
        })

    },

    createCartByUserId: (proId, userId) => {
        return new Promise((resolve, reject) => {
            let proObj = {
                item: objectId(proId),
                quantity: 1
            }
            let cartObj = {
                user: objectId(userId),
                products: [proObj]
            }

            db.get().collection(CART_COLLECTION).insertOne(cartObj).then((response) => {
                console.log(response)
                resolve()
            })
        })
    },

    pushProductToCart: (proId, userId) => {
        return new Promise((resolve, reject) => {

            let proObj = {
                item: objectId(proId),
                quantity: 1
            }

            db.get().collection(CART_COLLECTION)
                .updateOne({ user: objectId(userId) },
                    {
                        $push: { products: proObj }
                    }
                ).then(response => {
                    resolve()
                })
        })
    },

    getCartItems: (userId) => {

        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: PRODUCT_COLLETION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                }
            ]).toArray()
            resolve(cartItems)
            console.log(cartItems)

        })
    },

    incProductQuantity: (proId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(CART_COLLECTION)
                .updateOne({ 'products.item': objectId(proId) },
                    {
                        $inc: { 'products.$.quantity': 1 }
                    }
                ).then(response => {
                    resolve()
                })
        })


    }
}