const userServices = require('../services/user_collection');
const productServices = require('../services/product_collection');
const categoryServices = require('../services/category_collection');
const orderServices = require('../services/order_collection')



module.exports = {

    getAdminDashboard: (req, res) => {

        res.render('admin/dashboard',
            { layout: './layouts/adminLayout' });

    },

    getAdminLogin: (req, res) => {

        res.render('admin/admin-login', {
            errorMessage: req.flash('error'),
            layout: './layouts/plain'
        });
    },

   

    logAdminOut: (req, res) => {
        req.session.destroy(err => {
            console.log(err)
            res.redirect('/admin/login')
        })
    },

    // user Management

    userManagement: async (req, res) => {

        let users = await userServices.getAllUsers()
        res.render('admin/user-management',
            { users, layout: './layouts/adminLayout' });

    },

    blockUser: async (req, res, next) => {
        console.log('hey isa m in a her e blocl useres')
        let userId = req.params.id
        await userServices.blockUserAccess(userId)
        res.json(true)
    },

    unblockUser: async (req, res) => {
        let userId = req.params.id
        await userServices.unblockUserAccess(userId)
        res.json(true)
    },


    // product Management

    productManagement: async (req, res) => {
        productServices.getAllProducts().then((products) => {
            res.render('admin/product-management',
                { products, layout: './layouts/adminLayout' });
        })
    },

    getAddProduct: async (req, res) => {
        let categories = await categoryServices.getAllCategories()
        console.log(categories)
        res.render('admin/add-product',
            { categories, layout: './layouts/adminLayout' })

    },

    postAddProduct: (req, res) => {

        productServices.addProduct(req.body).then((id) => {
            console.log(id)

            let image = req.files.image
            image.mv('./public/images/product-images/' + id + '.webp', (err, done) => {
                if (!err) {

                    res.redirect('/admin/add-product')
                } else {
                    console.log(err)
                }
            })

        })

    },

    getEditProduct: (req, res) => {
        productServices.getProductById(req.params.id).then(async (product) => {
            console.log(product)
            let categories = await categoryServices.getAllCategories()
            res.render('admin/edit-product',
                { product, categories, layout: './layouts/adminLayout' })
        })

    },

    editProduct: (req, res) => {
        productServices.updateProductById(req.params.id, req.body)
        res.redirect('/admin/products')
        if (req.files.image) {
            let image = req.files.image
            let id = req.params.id
            image.mv('./public/images/product-images/' + id + '.webp')
        }
    },

    deleteProduct: (req, res) => {
        productServices.deleteProductById(req.params.id)
        res.json(true)
    },


    // category Management

    getCategory: async (req, res) => {

        let categories = await categoryServices.getAllCategories()
        res.render('admin/categories',
            {
                categories,
                errorMessage: req.flash('error'),
                layout: './layouts/adminLayout'
            });
    },

    addCategory: async (req, res) => {

        let categories = await categoryServices.getAllCategories()

        newCategory = req.body.category.toUpperCase()
        let categoryExist = false

        for (let category of categories) {
            let status = category.category.includes(newCategory)
            if (status) {
                categoryExist = true
            }
        }
        if (!categoryExist) {
            categoryServices.addNewCategory(req.body)
            res.redirect('/admin/category')

        } else {
            req.flash('error', 'Category already exists')
            res.redirect('/admin/category')
        }



    },

    deleteCategory: (req, res) => {
        categoryServices.deleteCategoryById(req.params.id)
        res.redirect('/admin/category')

    },


    // order Management

    getOrderManagement: async (req, res) => {

        let orders = await orderServices.getAllOrders()
        console.log(orders)
        res.render('admin/order-management',
            {
                orders,
                layout: './layouts/adminLayout'
            })
    }






}