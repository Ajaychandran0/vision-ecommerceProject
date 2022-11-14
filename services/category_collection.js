const db = require('../models/connections')
const {CATEGORY_COLLECTION} = require('../models/collections')
const objectId= require('mongodb').ObjectId


module.exports = {

    getAllCategories: ()=>{
        return db.get().collection(CATEGORY_COLLECTION).find().toArray()
    },

    addNewCategory:(category)=>{
        category.date=new Date();
        db.get().collection(CATEGORY_COLLECTION).insertOne(category)
    },

    deleteCategoryById:(catId)=>{
        db.get().collection(CATEGORY_COLLECTION).deleteOne({_id:objectId(catId)})
    }


}
