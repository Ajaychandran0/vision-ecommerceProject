/* eslint-disable no-async-promise-executor */
const db = require('../models/connections')
const { PRODUCT_COLLECTION } = require('../models/collections')
const objectId = require('mongodb').ObjectId

module.exports = {

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      const products = await db.get().collection(PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },

  addProduct: (productData, urls, cloudinaryIds) => {
    return new Promise((resolve, reject) => {
      productData.stock = Number(productData.stock)
      productData.price = parseFloat(productData.price)
      productData.offerPrice = parseInt(productData.price)
      productData.productOffer = 0
      productData.categoryOffer = 0
      productData.images = urls
      productData.cloudImageId = cloudinaryIds

      db.get().collection(PRODUCT_COLLECTION).insertOne(productData).then((data) => {
        const id = data.insertedId.toString()
        resolve(id)
      })
    })
  },

  getProductById: (productId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).findOne({ _id: objectId(productId) }).then((data) => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getProductByCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      const products = await db.get().collection(PRODUCT_COLLECTION).find({ category }).toArray()
      resolve(products)
    })
  },

  updateProductById: (productId, productDetails, urls, cloudImageId) => {
    productDetails.stock = Number(productDetails.stock)
    productDetails.price = parseFloat(productDetails.price)
    productDetails.productOffer = Number(productDetails.productOffer)
    productDetails.categoryOffer = Number(productDetails.categoryOffer)

    if (productDetails.productOffer > productDetails.categoryOffer) {
      productDetails.offerPrice = Number(productDetails.price - (productDetails.price * productDetails.productOffer / 100))
    } else {
      productDetails.offerPrice = Number(productDetails.price - (productDetails.price * productDetails.categoryOffer / 100))
    }

    if (productDetails.productOffer > productDetails.categoryOffer) {
      productDetails.offerPrice = Number(productDetails.price - (productDetails.price * productDetails.productOffer / 100))
    } else {
      productDetails.offerPrice = Number(productDetails.price - (productDetails.price * productDetails.categoryOffer / 100))
    }

    db.get().collection(PRODUCT_COLLECTION).updateOne({ _id: objectId(productId) }, {
      $set: {
        brand: productDetails.brand,
        name: productDetails.name,
        category: productDetails.category,
        stock: productDetails.stock,
        price: productDetails.price,
        size: productDetails.size,
        color: productDetails.color,
        description: productDetails.description,
        offerPrice: productDetails.offerPrice,
        productOffer: productDetails.productOffer,
        categoryOffer: productDetails.categoryOffer,
        images: urls,
        cloudImageId
      }
    })
  },

  deleteProductById: (productId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).deleteOne({ _id: objectId(productId) }).then(() => {
        resolve()
      })
    })
  },

  getAllProductOffer: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).aggregate(
        [{
          $match: {
            productOffer: {
              $gt: 0
            }
          }
        }, {
          $project: {
            name: 1,
            productOffer: 1
          }
        }]
      ).toArray().then((offerProducts) => {
        resolve(offerProducts)
      })
    })
  },

  addNewProductOffer: (proId, offerPercentage) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, { $set: { productOffer: offerPercentage } }).then(() => {
        resolve()
      })
    })
  },

  deleteProOfferById: (proId, newOfferPrice) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION)
        .updateOne({ _id: objectId(proId) }, { $set: { productOffer: 0, offerPrice: newOfferPrice } }).then(() => {
          resolve()
        })
    })
  },

  updateProductOfferPrice: (proId, offerPrice) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, { $set: { offerPrice } }).then(() => {
        resolve()
      })
    })
  },

  updateCategoryOffer: (category, offerPercentage) => {
    return new Promise((resolve, reject) => {
      db.get().collection(PRODUCT_COLLECTION).updateMany({ category }, { $set: { categoryOffer: offerPercentage } }).then(() => {
        resolve()
      })
    })
  }

}
