const db = require('../models/connections')
const { COUPON_COLLECTION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

  getAllCoupons: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).find({}).toArray().then((coupons) => {
        resolve(coupons)
      })
    })
  },

  checkCouponExists: (couponCode) => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).findOne({ coupon: couponCode }).then((coupon) => {
        resolve(coupon)
      })
    })
  },

  addNewCoupon: (couponDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).insertOne(couponDetails).then(() => {
        resolve()
      })
    })
  },

  deleteCouponById: (couponId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).deleteOne({ _id: objectId(couponId) }).then((response) => {
        resolve(response)
      })
    })
  },

  checkUserClaimed: (userId, couponCode) => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).findOne({ $and: [{ coupon: couponCode }, { users: objectId(userId) }] }).then((user) => {
        resolve(user)
      })
    })
  },

  checkCouponExpired: (couponCode) => {
    return new Promise((resolve, reject) => {
      db.get().collection(COUPON_COLLECTION).findOne({ $and: [{ coupon: couponCode }, { isoDate: { $gte: new Date() } }] }).then((coupon) => {
        resolve(coupon)
      })
    })
  }
}
