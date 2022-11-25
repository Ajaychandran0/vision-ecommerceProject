const db = require('../models/connections')
const { ADDRESS_COLLECTION } = require('../models/collections')
const { ObjectId } = require('mongodb')


module.exports = {

    addAddressByUserId: (userId, address) => {

        address._id = new ObjectId()
        return new Promise((resolve, reject) => {
            console.log(address)

            let addressObj = {
                user: ObjectId(userId),
                addresses: [address]
            }
            db.get().collection(ADDRESS_COLLECTION).insertOne(addressObj).then((response) => {
                resolve()
            })
        })
    },



    pushNewAddress: (userId, address) => {

        address._id = new ObjectId()
        return new Promise((resolve, reject) => {

            db.get().collection(ADDRESS_COLLECTION)
                .updateOne({ user: ObjectId(userId) },
                    {
                        $push: { addresses: address }
                    }
                ).then((response) => {
                    resolve()
                })
        })
    },


    getAddressesByUserId: (userId) => {

        return new Promise(async (resolve, reject) => {

            let addresses = db.get().collection(ADDRESS_COLLECTION).findOne({ user: ObjectId(userId) })
            resolve(addresses)
        })
    },

    getAddressByAddressId: (userId, addressId) => {

        return new Promise(async (resolve, reject) => {
            let address = await db.get().collection(ADDRESS_COLLECTION).aggregate([
                {
                    $match: {
                        user: ObjectId(userId)
                    }
                }, {
                    $unwind: '$addresses'
                }, {
                    $match: {
                        'addresses._id': ObjectId(addressId)
                    }
                }, {
                    $project: {
                        _id: 0,
                        addresses: 1
                    }
                }
            ]).toArray()

            resolve(address[0].addresses)

        })
    },

    updateUserAddress: (userId, addressId, address) => {

        return new Promise((resolve, reject) => {

            db.get().collection(ADDRESS_COLLECTION).updateOne(
                {
                    user: ObjectId(userId),
                    'addresses._id': ObjectId(addressId)
                },
                {
                    $set:{
                        "addresses.$.firstname":address.firstname,
                        "addresses.$.lastname":address.lastname,
                        "addresses.$.email":address.email,
                        "addresses.$.house":address.house,
                        "addresses.$.area":address.area,
                        "addresses.$.landmark":address.landmark,
                        "addresses.$.mobile":address.mobile,
                        "addresses.$.country":address.country,
                        "addresses.$.state":address.state,
                        "addresses.$.district":address.district,
                        "addresses.$.city":address.city,
                        "addresses.$.pincode":address.pincode

                    }
                }
            ).then(response=>{
                
                resolve({status:true})
            })

        })
    },

    deleteAddressById:(userId,addressId)=>{

        return new Promise((resolve,reject)=>{

            db.get().collection(ADDRESS_COLLECTION).updateOne(
                {
                    user: ObjectId(userId),
                    'addresses._id': ObjectId(addressId)
                },
                {
                    $pull:{
                        addresses:{_id:ObjectId(addressId)}
                    }
                }
            ).then(()=>{
                resolve()
            })
        })
    }


}