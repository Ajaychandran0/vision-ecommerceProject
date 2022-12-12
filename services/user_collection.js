/* eslint-disable no-async-promise-executor */
const db = require('../models/connections')
const { USER_COLLECTION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

  checkUserExist: (email, username) => {
    return db.get().collection(USER_COLLECTION).findOne({
      $or: [{
        email
      }, {
        username
      }]
    })
  },

  checKUserPhoneNoExist: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      const user = await db.get().collection(USER_COLLECTION).findOne({ phone: mobileNumber })
      resolve(user)
    })
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(USER_COLLECTION).insertOne(userData).then(() => {
        resolve()
      })
    })
  },

  getAllUsers: () => {
    return db.get().collection(USER_COLLECTION).find().toArray()
  },

  blockUserAccess: (userId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(USER_COLLECTION).updateOne({ _id: objectId(userId) }, { $set: { isActive: false } }).then(() => {
        resolve()
      })
    })
  },

  unblockUserAccess: (userId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(USER_COLLECTION).updateOne({ _id: objectId(userId) }, { $set: { isActive: true } }).then(() => {
        resolve()
      })
    })
  },

  getActiveUsersCount: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(USER_COLLECTION)
        .countDocuments({ isActive: true })
        .then((count) => {
          resolve(count)
        })
    })
  }

}
