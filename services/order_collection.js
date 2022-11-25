const db = require('../models/connections')
const { ORDER_COLLECTION } = require('../models/collections')
const ObjectId = require('mongodb').ObjectId


module.exports = {

    placeOrdeByUserId: (userId, order) => {

        userId = ObjectId(userId)
        order.user = userId
        
        return new Promise((resolve, reject) => {

            db.get().collection(ORDER_COLLECTION).insertOne(order).then(()=>{
                resolve()
            })

        })
    }
}