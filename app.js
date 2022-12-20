/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

// for otp working
const cors = require('cors');

const shopRouter = require('./routes/shop_routes')
const adminRouter = require('./routes/admin_routes')

// const fileUpload = require('express-fileupload')
const multer = require('multer')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)
const db = require('./models/connections')
const flash = require('connect-flash')

// connecting session to mongodb
const store = new mongodbStore({
  uri: 'mongodb://localhost:27017/vision_glasses',
  collection: 'sessions'
})
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/shopLayout')

// cache control middleware
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0')
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());
// app.use(multer().single('image'))
// app.use(fileUpload())
app.use(flash())

// mongodb session middleware
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}))

// connecting to database
db.connect((err) => {
  if (err) console.log('connection error' + err)
  else console.log('database connected succesfully to port 27017')
})

// setting user to locals
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.cartCount = req.session.cartCount
  res.locals.categories = req.session.categories
  next()
})

// routing
app.use('/admin', adminRouter)
app.use('/', shopRouter)

// catch 500 error
app.use('/500', (req, res) => {
  res.render('errors/500_error', { layout: './layouts/plain' })
})
// catch 404 and display 404 page
app.use(function (req, res, next) {
  res.render('errors/404_error')
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('errors/error')
})

// authentication and csrf token middelwares

app.listen(3000)
// module.exports = app;
