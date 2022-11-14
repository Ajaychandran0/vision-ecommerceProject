
const productServices =require('../services/product_collection');

module.exports = {

    home:(req,res)=>{
        productServices.getAllProducts().then((products)=>{
            res.render('shop/home',{products});
        })
       
    },

    about: (req,res)=>{
        res.render('shop/about')
    },

    cart:(req,res)=>{
        res.render('shop/cart') 
    },
    contact:(req,res)=>{
        res.render('shop/contact')   
    },

    men:(req,res)=>{
        res.render('shop/men') 
    },

    product:(req,res)=>{
        productServices.getProductById(req.params.id).then((product)=>{
            res.render('shop/product-detail',{product}) 
        })
    },

    women:(req,res)=>{
        res.render('shop/women')
    },

    



}
