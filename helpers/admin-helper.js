var service = require('../services/admin_collection')
const bcrypt = require('bcrypt')


module.exports={

    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            
            let response = {}           
            service.checkAdminExist(adminData.email).then((admin)=>{
                
                if (admin) {

                    bcrypt.compare(adminData.password,admin.password).then((status) => {
                        if (status) {
    
                            console.log('login successfull')
                            response.admin = admin
                            response.status = true
                            resolve(response)
                        } else {
                            console.log('login failed due to wrong password')
                            resolve({ status: false })
                        }
                    })
    
                } else {
                    console.log('login failed no user')
                    resolve({ status: false })
                }

            })
        })
    }

    
}