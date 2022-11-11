var userHelpers = require('../helpers/user_helper')


//verify login middleware
const verifyLogin = (req,res,next)=>{
    if(req.session.loggedAdminIn)
    next()
    else
    res.redirect("/admin/login")
  }

module.exports = {

    getSignup:(req,res)=>{
        res.render('user/signup',{layout:'./layouts/plain'});
    },

    SignupUser: (req, res)=> {

        userHelpers.doSignup(req.body).then((signUpFailed)=>{
            if(signUpFailed==true){
        
              req.session.signupErr=true
              res.redirect('/signup')
        
            }else{
              res.redirect('/login')
            }    
          })        
    },

    getLogin:  (req, res)=> {
             
        res.render('user/login',{loginErr:req.session.loginErr,layout:'./layouts/plain'})
        req.session.loginErr=false
      
    },

    loginUser: (req,res)=>{

        userHelpers.doLogin(req.body).then((response)=>{
          if(response.status){
            req.session.isLoggedIn=true
            req.session.user=response.user
            
            res.redirect('/')
          }else{
            req.session.loginErr=true
            res.redirect('/login')
          }
        })
    },
  
    otpLogin:(req, res)=> {
        res.render('user/otp-login',{layout:'./layouts/plain'});
        
    },

    checkout:(req, res)=> {
        res.render('user/checkout');  
    },

    orderComplete:(req, res)=> {
        res.render('user/order-complete');
    },

    wishlist:(req, res)=> {
        res.render('user/add-to-wishlist');
    },

    logout: (req,res)=>{
      req.session.isLoggedIn=false
      req.session.user=null
      res.redirect('/login')
    }

}