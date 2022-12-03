const db = require('../models/connections')
const { ORDER_COLLECTION } = require('../models/collections')
const ObjectId = require('mongodb').ObjectId


module.exports = {

    placeOrdeByUserId: (userId, order) => {

        userId = ObjectId(userId)
        order.user = userId
        order.date = new Date()

        return new Promise((resolve, reject) => {

            db.get().collection(ORDER_COLLECTION).insertOne(order).then((data) => {
                let orderId = data.insertedId.toString()
                resolve(orderId)
            })

        })
    },


    getUserOrders: (userId) => {

        return new Promise(async (resolve, reject) => {

            let orders = await db.get().collection(ORDER_COLLECTION).find({ user: ObjectId(userId) })
                .sort({ date: -1 })
                .toArray()
            resolve(orders)
        })

    },

    getAllOrders: () => {

        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(ORDER_COLLECTION).find().sort({ date: -1 }).toArray()
            resolve(orders)
        })
    },


    cancelOrderItem: (orderId, proId) => {
        console.log(proId)

        return new Promise(async (resolve, reject) => {

            await db.get().collection(ORDER_COLLECTION)
                .updateOne({ _id: ObjectId(orderId), 'orderItems.proId': ObjectId(proId) },
                    {
                        $set: { 'orderItems.$.itemStatus': 'cancelled' }
                    }
                )
            let total = await db.get().collection(ORDER_COLLECTION).aggregate(
                [{
                    $match: {
                        'orderItems.proId': ObjectId(proId)
                    }
                }, {
                    $unwind: '$orderItems'
                }, {
                    $match: {
                        'orderItems.proId': ObjectId(proId)
                    }
                }, {
                    $project: {
                        'orderItems.total': 1,
                        _id: 0
                    }
                }]
            ).toArray()
            total = total[0].orderItems.total
            console.log(total)

            await db.get().collection(ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId) },
                {
                    $inc: { totalPrice: -total }
                }
            )
            resolve(true)
        })
    },


    changeOrderItemStatus: (orderId, proId, status) => {

        return new Promise((resolve, reject) => {

            db.get().collection(ORDER_COLLECTION)
                .updateOne({ _id: ObjectId(orderId), 'orderItems.proId': ObjectId(proId) },
                    {
                        $set: { 'orderItems.$.itemStatus': status }
                    }
                ).then(() => {
                    resolve()
                })
        })
    },

    changePaymentStatus: (orderId) => {

        console.log(orderId)

        return new Promise(async (resolve, reject) => {

            await db.get().collection(ORDER_COLLECTION)
                .updateOne({ _id: ObjectId(orderId) },
                    {
                        $set: { status: 'placed' }
                    }
                )
           
            resolve()
        })
    }
}