const db = require('../models/connections')
const { ORDER_COLLECTION } = require('../models/collections')
const ObjectId = require('mongodb').ObjectId


module.exports = {

    placeOrdeByUserId: (userId, order) => {

        userId = ObjectId(userId)
        order.user = userId
        order.date = new Date()

        return new Promise((resolve, reject) => {

            db.get().collection(ORDER_COLLECTION).insertOne(order).then(() => {
                resolve()
            })

        })
    },


    getUserOrders: (userId) => {

        return new Promise(async (resolve, reject) => {

            let orders = await db.get().collection(ORDER_COLLECTION).find({ user: ObjectId(userId) })
                .sort({date:-1})
                .toArray()
            resolve(orders)
        })

    },

    getAllOrders:()=>{

        return new Promise (async(resolve,reject)=>{
            let orders = await db.get().collection(ORDER_COLLECTION).find().sort({date:-1}).toArray()
            resolve(orders)
        })
    }
}