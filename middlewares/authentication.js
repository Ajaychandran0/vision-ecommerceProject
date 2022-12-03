
module.exports = {

  verifyUserLogin: (req, res, next) => {
    if (req.session.isLoggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
  },

  verifyUserNotLogin: (req, res, next) => {
    if (!req.session.isLoggedIn) {
      next()
    } else {
      res.redirect('/')
    }
  },

  verifyAdminLogin: (req, res, next) => {
    if (req.session.loggedAdminIn) {
      next()
    } else {
      res.redirect('/admin/login')
    }
  },

  verifyAdminNotLogin: (req, res, next) => {
    if (!req.session.loggedAdminIn) {
      next()
    } else {
      res.redirect('/admin')
    }
  }

}
