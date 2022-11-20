const db = require('../models/connections')
const { PRODUCT_COLLETION } = require('../models/collections')
const objectId = require('mongodb').ObjectId


module.exports = {

    getAllProducts: () => {

        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(PRODUCT_COLLETION).find().toArray()
            resolve(products)
        })
    },

    addProduct: (productData) => {

        return new Promise((resolve, reject) => {
            productData.stock = Number(productData.stock)
            productData.price = parseFloat(productData.price)
            db.get().collection(PRODUCT_COLLETION).insertOne(productData).then((data) => {

                let id = data.insertedId.toString()
                resolve(id)
            })
        })
    },

    getProductById: (productId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(PRODUCT_COLLETION).findOne({ _id: objectId(productId) }).then((data) => {
                resolve(data)
            })
        })
    },


    getProductByCategory: (category)=>{
        console.log(category+"hey hey hey getProductBy Category")
        

        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(PRODUCT_COLLETION).find({category:category}).toArray()
            console.log(products+'eh eh eh getProcuct By Categroyry')
            resolve(products)
        })

    },




    updateProductById: (productId, productDetails) => {

        productDetails.stock = Number(productDetails.stock)
        productDetails.price = parseFloat(productDetails.price)

        db.get().collection(PRODUCT_COLLETION).updateOne({ _id: objectId(productId) }, {
            $set: {
                brand: productDetails.brand,
                name: productDetails.name,
                category: productDetails.category,
                stock: productDetails.stock,
                price: productDetails.price,
                size: productDetails.size,
                color: productDetails.color,
                description: productDetails.description
            }
        })
    },

    deleteProductById: (productId) => {
        db.get().collection(PRODUCT_COLLETION).deleteOne({ _id: objectId(productId) })
    }

}