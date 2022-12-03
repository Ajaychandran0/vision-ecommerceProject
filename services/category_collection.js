/* eslint-disable no-async-promise-executor */
const db = require('../models/connections')
const { CATEGORY_COLLECTION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

  getAllCategories: () => {
    return db.get().collection(CATEGORY_COLLECTION).find().toArray()
  },

  getCategoryById: (catId) => {
    return new Promise(async (resolve, reject) => {
      const { category } = await db.get().collection(CATEGORY_COLLECTION).findOne({ _id: objectId(catId) })
      resolve(category)
    })
  },

  addNewCategory: (category) => {
    category.category = category.category.toUpperCase()
    category.date = new Date()
    console.log(category)
    db.get().collection(CATEGORY_COLLECTION).insertOne(category)
  },

  deleteCategoryById: (catId) => {
    db.get().collection(CATEGORY_COLLECTION).deleteOne({ _id: objectId(catId) })
  }

}
