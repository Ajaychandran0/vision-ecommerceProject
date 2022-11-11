
var userServices = require('../services/user_collection');
var adminHelpers = require('../helpers//admin-helper')
var productServices =require('../services/product_collection');
var categoryServices = require('../services/category_collection');
const { query } = require('express');



module.exports={

    getAdminDashboard:(req, res)=> {  
  
        res.render('admin/dashboard',
        {layout:'./layouts/adminLayout'});
        
    },

    getAdminLogin:(req,res)=>{

        res.render('admin/admin-login',
        {layout:'./layouts/plain'});
    },

    logAdminIn:(req,res)=>{

        adminHelpers.doLogin(req.body).then((response)=>{
            if(response.status){
                req.session.loggedAdminIn=true
                req.session.admin=response.admin
                res.redirect('/admin')
            }else{
                req.session.loginErr=true
                res.redirect('/admin/login')
            }
        })
    },

    logAdminOut:(req,res)=>{
        
        req.session.loggedAdminIn=false
        req.session.admin=null
        res.redirect('/admin/login')

    },

    // user Management

    userManagement:async(req, res)=> {

        let users= await userServices.getAllUsers()
        res.render('admin/user-management',
        {users,layout:'./layouts/adminLayout'});
        
    },

    blockUser:(req,res,next)=>{
        let userId=req.params.id
        userServices.blockUserAccess(userId)
        res.redirect('/admin/users')
    },
    
    unblockUser:(req,res)=>{
        let userId=req.params.id
        userServices.unblockUserAccess(userId)
        res.redirect('/admin/users')
    },


    // product Management

    productManagement:async(req, res)=> {
        productServices.getAllProducts().then((products)=>{
            res.render('admin/product-management',
            {products,layout:'./layouts/adminLayout'});
        })  
    },

    getAddProduct:(req,res)=>{
        res.render('admin/add-product',
        {layout:'./layouts/adminLayout'})
      
    },

    postAddProduct:(req,res)=>{

        productServices.addProduct(req.body).then((id)=>{
            console.log(id)

            let image=req.files.image
            image.mv('./public/images/product-images/'+id+'.webp',(err,done)=>{
                if(!err){

                    res.redirect('/admin/add-product') 
                }else{
                    console.log(err)
                }
            }) 
                
        })
         
    },

    getEditProduct:(req,res)=>{
        productServices.getProductById(req.params.id).then((product)=>{
            res.render('admin/edit-product',
            {product,layout:'./layouts/adminLayout'})
        })
        
    },

    editProduct:(req,res)=>{
        productServices.updateProductById(req.params.id,req.body)
        res.redirect('/admin/products')
    },

    deleteProduct:(req,res)=>{
        productServices.deleteProductById(req.params.id)
        res.redirect('/admin/products')
    },


    // category Management

    getCategory:async(req,res)=>{

        let categories= await categoryServices.getAllCategories()
        res.render('admin/categories',
        {categories,layout:'./layouts/adminLayout'});
    },

    addCategory:(req,res)=>{

        categoryServices.addNewCategory(req.body)
        res.redirect('/admin/category')
    },

    deleteCategory:(req,res)=>{
        categoryServices.deleteCategoryById(req.params.id)
        res.redirect('/admin/category')

    }

    

    

    
}