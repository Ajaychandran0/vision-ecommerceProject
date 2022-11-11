
const bcrypt = require('bcrypt')

var service = require('../services/user_collection')


module.exports = {

    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            // let result
            console.log(userData.email)

            let user =await service.checkUserExist(userData.email,userData.username)
            console.log(user)
            
            let userExist=false
            if (user) {

                console.log('user exists')
                userExist= true
                resolve(userExist)

            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                console.log('user added successfully')
                userData.isActive=true

                service.createUser(userData)
                resolve(false)
                
            }
        })

    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            
            let response = {}
            let email =userData.email_username
            let username = userData.email_username
            
            let user = await service.checkUserExist(email,username)
            let active=user.isActive
            if (active) {

                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        console.log('login successfull')
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }
                })

            } else {
                console.log('login failed')
                resolve({ status: false })
            }
        })
    },


}
