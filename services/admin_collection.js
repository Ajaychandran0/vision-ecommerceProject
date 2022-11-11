var db = require('../models/connections')
var {ADMIN_COLLECTION} = require('../models/collections')




module.exports = {

    checkAdminExist:(email)=>{

        return new Promise((resolve,reject)=>{

            db.get().collection(ADMIN_COLLECTION).findOne({email:email}).then((data)=>{
    
                resolve(data)
            })
        })
    }
}