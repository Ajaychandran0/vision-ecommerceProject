const db = require('../models/connections')
const {USER_COLLECTION} = require('../models/collections')
const objectId= require('mongodb').ObjectId



module.exports = {

    checkUserExist:(email,username)=>{
      
        return db.get().collection(USER_COLLECTION).findOne({
            $or: [{
                email:email
            }, {
                username:username
            }]
        })
        
    },

    createUser: (userData)=>{
         db.get().collection(USER_COLLECTION).insertOne(userData)
    },
    
    getAllUsers: ()=>{
        return db.get().collection(USER_COLLECTION).find().toArray()
    },

    blockUserAccess:(userId)=>{
        db.get().collection(USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{isActive:false}})
    },

    unblockUserAccess:(userId=>{
        db.get().collection(USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{isActive:true}})
    })


}