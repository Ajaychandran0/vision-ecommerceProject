var db = require('../models/connections')
var {PRODUCT_COLLETION} = require('../models/collections')
var objectId= require('mongodb').ObjectId


module.exports = {

    getAllProducts: ()=>{
        
        return new Promise(async(resolve,reject)=>{
            let products= await db.get().collection(PRODUCT_COLLETION).find().toArray()
            resolve(products)
        })
    },

    addProduct:(productData)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(PRODUCT_COLLETION).insertOne(productData).then((data)=>{

                let id = data.insertedId.toString()
                resolve(id)
            })
        }) 
    },

    getProductById:(productId)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(PRODUCT_COLLETION).findOne({_id:objectId(productId)}).then((data)=>{
                resolve(data)
            })
        })
    },

    updateProductById:(productId,productDetails)=>{
        db.get().collection(PRODUCT_COLLETION).updateOne({_id:objectId(productId)},{
            $set:{
                name:productDetails.name,
                discription:productDetails.discription,
                price:productDetails.price,
                category:productDetails.category
            }
        })
    },

    deleteProductById:(productId)=>{
        db.get().collection(PRODUCT_COLLETION).deleteOne({_id:objectId(productId)})
    }

}