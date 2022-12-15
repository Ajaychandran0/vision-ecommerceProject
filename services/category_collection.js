/* eslint-disable no-async-promise-executor */
const db = require('../models/connections')
const { CATEGORY_COLLECTION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

  getAllCategories: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).find().toArray().then((categories) => {
        resolve(categories)
      })
    })
  },

  getAllcategoryList: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).aggregate([{
        $project: {
          _id: 0,
          category: 1
        }
      }]).toArray().then((categories) => {
        resolve(categories)
      })
    })
  },

  getCategoryById: (catId) => {
    return new Promise(async (resolve, reject) => {
      const categoryData = await db.get().collection(CATEGORY_COLLECTION).findOne({ _id: objectId(catId) })
      resolve(categoryData.category)
    })
  },

  addNewCategory: (category) => {
    category.category = category.category.toUpperCase()
    category.date = new Date()
    category.categoryOffer = 0

    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).insertOne(category).then(() => {
        resolve()
      })
    })
  },

  deleteCategoryById: (catId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).deleteOne({ _id: objectId(catId) }).then(() => {
        resolve()
      })
    })
  },

  getAllCategoryOffer: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).find({ categoryOffer: { $gt: 0 } }).toArray().then((categoryOffer) => {
        resolve(categoryOffer)
      })
    })
  },

  updateCategoryOffer: (category, offerPercentage) => {
    return new Promise((resolve, reject) => {
      db.get().collection(CATEGORY_COLLECTION).updateOne({ category }, { $set: { categoryOffer: offerPercentage } }).then((res) => {
        console.log(res)
        resolve()
      })
    })
  }

}
