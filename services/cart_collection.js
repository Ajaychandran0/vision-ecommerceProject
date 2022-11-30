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
                        from: 'product',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } },
                        quantity: 1,
                        product: 1
                    }
                }
            ]).toArray()
            resolve(cartItems)
        })
    },

    incProductQuantity: (cartId, proId, count = 1) => {

        count = parseInt(count)
        return new Promise((resolve, reject) => {
            db.get().collection(CART_COLLECTION)
                .updateOne({ _id: objectId(cartId), 'products.item': objectId(proId) },
                    {
                        $inc: { 'products.$.quantity': count }
                    }
                ).then(response => {
                    resolve({ status: true })
                })
        })


    },

    removeProductFromCart: (cartId, proId) => {


        return new Promise((resolve, reject) => {

            db.get().collection(CART_COLLECTION)
                .updateOne({ _id: objectId(cartId) },
                    {
                        $pull: { products: { item: objectId(proId) } }
                    }
                ).then((response) => {

                    resolve({ productRemove: true })
                })
        })
    },

    getTotalPrice: (userId) => {

        return new Promise(async (resolve, reject) => {
            let subTotal = await db.get().collection(CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project:
                    {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup:
                    {
                        from: PRODUCT_COLLETION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }
            ]).toArray()
            if(subTotal[0]) resolve(subTotal[0].total)
            else resolve()

        })
    },


    deleteCartByUserId: (userId) => {

        return new Promise((resolve,reject)=>{

            db.get().collection(CART_COLLECTION).deleteOne({user:objectId(userId)}).then(()=>{
                resolve()
            })
        })

    }
}