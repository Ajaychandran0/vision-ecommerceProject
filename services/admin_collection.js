const db = require('../models/connections')
const { ADMIN_COLLECTION } = require('../models/collections')

module.exports = {

  checkAdminExist: (email) => {
    return new Promise((resolve, reject) => {
      db.get().collection(ADMIN_COLLECTION).findOne({ email }).then((data) => {
        resolve(data)
      })
    })
  }
}
