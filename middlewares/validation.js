const { check, validationResult } = require('express-validator')

const signupValidation = [

  check('email')
    .isEmail()
    .withMessage('please enter a valid email address'),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      const error = errors.array()[0].msg
      req.flash('error', error)
      res.status(422).redirect('/signup')
    }
    next()
  }

]

module.exports = signupValidation
