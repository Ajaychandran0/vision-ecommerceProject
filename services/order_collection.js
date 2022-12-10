/* eslint-disable eqeqeq */
/* eslint-disable no-async-promise-executor */
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
        const orderId = data.insertedId.toString()
        resolve(orderId)
      })
    })
  },

  getUserOrders: (userId) => {
    return new Promise(async (resolve, reject) => {
      const orders = await db.get().collection(ORDER_COLLECTION).find({ user: ObjectId(userId) })
        .sort({ date: -1 })
        .toArray()
      resolve(orders)
    })
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      const orders = await db.get().collection(ORDER_COLLECTION).find().sort({ date: -1 }).toArray()
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
            $set: {
              'orderItems.$.itemStatus': status,
              'orderItems.$.statusUpdateDate': new Date()
            }
          }
        ).then(() => {
          resolve()
        })
    })
  },

  changePaymentStatus: (orderId) => {
    return new Promise(async (resolve, reject) => {
      await db.get().collection(ORDER_COLLECTION)
        .updateOne({ _id: ObjectId(orderId) },
          {
            $set: { status: 'placed' }
          }
        )
      resolve()
    })
  },

  queryDeliveredOrderList: (year, month) => {
    return new Promise(async (resolve, reject) => {
      const deliveredList = [
        {
          $unwind: '$orderItems'
        }, {
          $match: {
            'orderItems.itemStatus': 'delivered'
          }
        }, {
          $project: {
            price: '$orderItems.total',
            paymentMehod: 1,
            statusUpdateDate: '$orderItems.statusUpdateDate',
            status: '$orderItems.itemStatus',
            couponCode: 1,
            couponPercentage: 1,
            proId: '$orderItems.proId',
            qty: '$orderItems.quantity',
            offerPrice: '$orderItems.product.offerPrice',
            actualPrice: '$orderItems.product.price'
          }
        }
      ]

      if (month) {
        const start = '1'
        let end = '31'

        // set end date
        if (month % 2 == 0 && month <= 7 && month != 2) {
          end = '30'
        } else if (month % 2 != 0 && month > 7) {
          end = '30'
        } else if (month == 2) {
          const date = new Date('2024/02/12')
          const year = date.getFullYear()
          // check for leap year
          if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            end = '29'
          } else {
            end = '28'
          }
        }
        const startDate = month.concat('/' + start + '/' + year)
        const fromDate = new Date(new Date(startDate).getTime() + 3600 * 24 * 1000)

        const endDate = month.concat('/' + end + '/' + year)
        const toDate = new Date(new Date(endDate).getTime() + 3600 * 24 * 1000)

        const dbQuery = {
          $match: {
            statusUpdateDate: {
              $gte: fromDate,
              $lte: toDate
            }
          }
        }

        deliveredList.push(dbQuery)
        db.get().collection(ORDER_COLLECTION).aggregate(deliveredList).toArray()
          .then((deliveredOrders) => {
            resolve(deliveredOrders)
          })
      } else if (year) {
        const dateRange = year.daterange.split('-')
        let [from, to] = dateRange
        from = from.trim('')
        to = to.trim('')
        const fromDate = new Date(new Date(from).getTime() + 3600 * 24 * 1000); console.log(fromDate)
        const toDate = new Date(new Date(to).getTime() + 3600 * 24 * 1000)

        const dbQuery = {
          $match: {
            statusUpdateDate: {
              $gte: fromDate,
              $lte: toDate
            }
          }
        }

        deliveredList.push(dbQuery)
        db.get().collection(ORDER_COLLECTION).aggregate(deliveredList).toArray()
          .then((deliveredOrders) => {
            resolve(deliveredOrders)
          })
      } else {
        db.get().collection(ORDER_COLLECTION).aggregate(deliveredList).toArray()
          .then((deliveredOrders) => {
            resolve(deliveredOrders)
          })
      }
    })
  }
}
