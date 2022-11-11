
var productServices =require('../services/product_collection');

module.exports = {

    home:(req,res)=>{
        let user= req.session.user 
        productServices.getAllProducts().then((products)=>{
            res.render('shop/home',{products,user});
        })
       
    },

    about: (req,res)=>{
        let user= req.session.user 
        res.render('shop/about',{user})
    },

    cart:(req,res)=>{
        let user= req.session.user 
        res.render('shop/cart',{user}) 
    },
    contact:(req,res)=>{
        let user= req.session.user 
        res.render('shop/contact',{user})   
    },

    men:(req,res)=>{
        let user= req.session.user 
        res.render('shop/men',{user}) 
    },

    product:(req,res)=>{
        let user= req.session.user 
        productServices.getProductById(req.params.id).then((product)=>{

            res.render('shop/product-detail',{user,product}) 
        })
         
    },

    women:(req,res)=>{
        let user= req.session.user 
        res.render('shop/women',{user})
    },

    



}
