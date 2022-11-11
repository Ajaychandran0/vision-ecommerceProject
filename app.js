var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts')

var shopRouter = require('./routes/shop');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');


var fileUpload=require('express-fileupload')
var session = require('express-session')
var db = require('./models/connections')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.set('layout','./layouts/shopLayout')

// cache control middleware
app.use((req,res,next)=>{
  res.set('Cache-Control','no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0')
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(fileUpload())
app.use(session({
  secret:'key',
  resave:false,
  saveUninitialized:false,
  cookie:{maxAge:6000000}}))

// connecting to database
db.connect((err)=>{
  if(err) console.log('connection error'+err);
  else console.log('database connected succesfully to port 27017');
})

app.use('/', shopRouter);
app.use('/admin', adminRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// authentication and csrf token middelwares





module.exports = app;
