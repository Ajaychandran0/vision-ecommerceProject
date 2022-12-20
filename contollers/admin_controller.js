const userServices = require('../services/user_collection')
const productServices = require('../services/product_collection')
const categoryServices = require('../services/category_collection')
const orderServices = require('../services/order_collection')
const couponServices = require('../services/coupon_collection')
const cloudinary = require('../utils/cloudinary')

// const { order } = require('paypal-rest-sdk')

module.exports = {

  getAdminLogin: (req, res) => {
    res.render('admin/admin-login', {
      errorMessage: req.flash('error'),
      layout: './layouts/plain'
    })
  },

  logAdminOut: (req, res) => {
    req.session.destroy(err => {
      console.log(err)
      res.redirect('/admin/login')
    })
  },

  // admin dashboard

  getAdminDashboard: async (req, res) => {
    const deliveredOrders = await orderServices.queryDeliveredOrderList()
    const totalDeliveredOrders = deliveredOrders.length
    const activeUsers = await userServices.getActiveUsersCount()
    const totalOrders = await orderServices.getTotalOrdersCount()
    const ordersToday = await orderServices.getTodaysOrders()
    const returnedOrders = await orderServices.getTotalReturnedOrders()

    let totalCouponDiscount = 0
    for (const order of deliveredOrders) {
      if (order.couponCode) {
        const couponDiscount = (order.price * order.couponPercentage) / 100
        totalCouponDiscount += couponDiscount
      }
    }
    const total = deliveredOrders.reduce((acc, item) => acc + item.price, 0)
    const totalRevenue = total - totalCouponDiscount

    res.render('admin/dashboard',
      {
        totalDeliveredOrders,
        totalOrders,
        returnedOrders,
        ordersToday,
        activeUsers,
        totalRevenue,
        layout: './layouts/adminLayout'
      })
  },

  getCategoryChart: async (req, res) => {
    const categories = await categoryServices.getAllcategoryList()
    const categoryCount = await orderServices.queryCategorySoldDetails(categories)
    res.json(categoryCount)
  },

  getPaymentMethodChart: async (req, res) => {
    const paymentMethod = await orderServices.queryPaymentMethodDetails()
    res.json(paymentMethod)
  },

  getOrderStatusChart: async (req, res) => {
    const orderStatus = await orderServices.queryOrderStatusDetails()
    res.json(orderStatus)
  },

  // user Management

  userManagement: async (req, res) => {
    const users = await userServices.getAllUsers()
    res.render('admin/user-management',
      { users, layout: './layouts/adminLayout' })
  },

  blockUser: async (req, res, next) => {
    const userId = req.params.id
    await userServices.blockUserAccess(userId)
    res.json(true)
  },

  unblockUser: async (req, res) => {
    const userId = req.params.id
    await userServices.unblockUserAccess(userId)
    res.json(true)
  },

  // product Management

  productManagement: async (req, res) => {
    productServices.getAllProducts().then((products) => {
      res.render('admin/product-management',
        { products, layout: './layouts/adminLayout' })
    })
  },

  getAddProduct: async (req, res) => {
    const categories = await categoryServices.getAllCategories()
    res.render('admin/add-product',
      { categories, layout: './layouts/adminLayout' })
  },

  postAddProduct: async (req, res) => {
    try {
      console.log(req.body)
      const cloudinaryUpload = (file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file, (err, res) => {
            if (err) { return res.status(500).send('upload image error') }
            const result = {}
            result.url = res.secure_url
            result.id = res.public_id
            resolve(result)
          })
        })
      }
      const files = req.files
      const arr1 = Object.values(files)
      const arr2 = arr1.flat()
      const cloudData = await Promise.all(
        arr2.map(async (file) => {
          const { path } = file
          const result = await cloudinaryUpload(path)
          return result
        })
      )
      const urls = {}
      urls.image1 = cloudData[0].url
      urls.image2 = cloudData[1].url
      urls.image3 = cloudData[2].url
      urls.image4 = cloudData[3].url
      const cloudImageId = {}
      cloudImageId.image1 = cloudData[0].id
      cloudImageId.image2 = cloudData[1].id
      cloudImageId.image3 = cloudData[2].id
      cloudImageId.image4 = cloudData[3].id

      await productServices.addProduct(req.body, urls, cloudImageId)
      res.redirect('/admin/add-product')
    } catch (e) {
      console.log(e)
    }
  },

  getEditProduct: (req, res) => {
    productServices.getProductById(req.params.id).then(async (product) => {
      const categories = await categoryServices.getAllCategories()
      res.render('admin/edit-product',
        { product, categories, layout: './layouts/adminLayout' })
    })
  },

  editProduct: async (req, res) => {
    const cloudinaryUpload = (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, (err, res) => {
          if (err) { return res.status(500).send('upload image error') }
          const result = {}
          result.url = res.secure_url
          result.id = res.public_id
          resolve(result)
        })
      })
    }

    const files = req.files
    const urls = {}
    const cloudImageId = {}

    if (files.image1) {
      await cloudinary.uploader.destroy(req.body.imageId1)
      const { path } = files.image1[0]
      const cloudData = cloudinaryUpload(path)
      urls.image1 = cloudData.url
      cloudImageId.image1 = cloudData.id
    } else {
      urls.image1 = req.body.image1
      cloudImageId.image1 = req.body.imageId1
    }

    if (files.image2) {
      await cloudinary.uploader.destroy(req.body.imageId2)
      const { path } = files.image2[0]
      const cloudData = cloudinaryUpload(path)
      urls.image2 = cloudData.url
      cloudImageId.image2 = cloudData.id
    } else {
      urls.image2 = req.body.image2
      cloudImageId.image2 = req.body.imageId2
    }

    if (files.image3) {
      await cloudinary.uploader.destroy(req.body.imageId3)
      const { path } = files.image3[0]
      const cloudData = cloudinaryUpload(path)
      urls.image3 = cloudData.url
      cloudImageId.image3 = cloudData.id
    } else {
      urls.image3 = req.body.image3
      cloudImageId.image3 = req.body.imageId3
    }

    if (files.image4) {
      await cloudinary.uploader.destroy(req.body.imageId4)
      const { path } = files.image4[0]
      const cloudData = cloudinaryUpload(path)
      urls.image4 = cloudData.url
      cloudImageId.image4 = cloudData.id
    } else {
      urls.image4 = req.body.image4
      cloudImageId.image4 = req.body.imageId4
    }

    productServices.updateProductById(req.params.id, req.body, urls, cloudImageId)
    res.redirect('/admin/products')
  },

  deleteProduct: async (req, res) => {
    console.log(req.body)
    await cloudinary.uploader.destroy(req.body.image1)
    await cloudinary.uploader.destroy(req.body.image2)
    await cloudinary.uploader.destroy(req.body.image3)
    await cloudinary.uploader.destroy(req.body.image4)
    productServices.deleteProductById(req.params.id)
    res.redirect('/admin/products')
  },

  // category Management

  getCategory: async (req, res) => {
    const categories = await categoryServices.getAllCategories()
    res.render('admin/categories',
      {
        categories,
        errorMessage: req.flash('error'),
        layout: './layouts/adminLayout'
      })
  },

  addCategory: async (req, res) => {
    const categories = await categoryServices.getAllCategories()

    const newCategory = req.body.category.toUpperCase()
    let categoryExist = false

    for (const category of categories) {
      const status = category.category.includes(newCategory)
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
    const orders = await orderServices.getAllOrders()
    res.render('admin/order-management',
      {
        orders,
        layout: './layouts/adminLayout'
      })
  },

  changeOrderStatus: async (req, res) => {
    const proId = req.body.proId
    const orderId = req.body.orderId
    const orderStatus = req.body.status
    if (orderStatus === 'cancelled') {
      await orderServices.cancelOrderItem(orderId, proId)
      res.json({ cancelled: true })
    } else {
      await orderServices.changeOrderItemStatus(orderId, proId, orderStatus)
      if (orderStatus === 'returned') {
        res.json({ returned: true })
      } else {
        res.json(true)
      }
    }
  },

  // offer management

  getOfferManagement: async (req, res) => {
    const categories = await categoryServices.getAllCategories()
    const products = await productServices.getAllProducts()
    const productOffers = await productServices.getAllProductOffer()
    const categoryOffers = await categoryServices.getAllCategoryOffer()

    res.render('admin/offer-management',
      {
        categories,
        products,
        productOffers,
        categoryOffers,
        layout: './layouts/adminLayout'
      }
    )
  },

  addCategoryOffer: async (req, res) => {
    const category = req.body.category
    const offerPercentage = Number(req.body.percentage)

    await categoryServices.updateCategoryOffer(category, offerPercentage)
    await productServices.updateCategoryOffer(category, offerPercentage)

    const products = await productServices.getProductByCategory(category)

    for (const product of products) {
      if (product.categoryOffer > product.productOffer) {
        const discount = (product.price * product.categoryOffer) / 100
        const offerPrice = (product.price - discount)
        await productServices.updateProductOfferPrice(product._id, offerPrice)
      }
    }
    res.redirect('/admin/offers')
  },

  deleteCategoryOffer: async (req, res) => {
    const category = req.body.category
    const catOffer = 0

    await categoryServices.updateCategoryOffer(category, catOffer)
    const products = await productServices.getProductByCategory(category)

    for (const product of products) {
      if (product.productOffer <= product.categoryOffer) {
        const discount = (product.price * product.productOffer) / 100
        const offerPrice = (product.price - discount)
        await productServices.updateProductOfferPrice(product._id, offerPrice)
      }
    }
    await productServices.updateCategoryOffer(category, catOffer)

    res.json(true)
  },

  addProductOffer: async (req, res) => {
    const proId = req.body.product
    const offerPercentage = Number(req.body.percentage)

    await productServices.addNewProductOffer(proId, offerPercentage)

    const product = await productServices.getProductById(proId)

    if (product?.productOffer >= product?.categoryOffer) {
      const discount = (product.price * product.productOffer) / 100
      const offerPrice = (product.price - discount)
      await productServices.updateProductOfferPrice(proId, offerPrice)
    }
    res.redirect('/admin/offers')
  },

  deleteProductOffer: async (req, res) => {
    const proId = req.body.proId
    const product = await productServices.getProductById(proId)
    let newOfferPrice

    if (product.categoryOffer !== 0) {
      const newDiscount = (product.price * product.categoryOffer) / 100
      newOfferPrice = (product.price - newDiscount)
    } else {
      newOfferPrice = product.price
    }
    await productServices.deleteProOfferById(proId, newOfferPrice)

    res.json(true)
  },

  // coupon management

  getCouponManagement: async (req, res) => {
    const coupons = await couponServices.getAllCoupons()

    res.render('admin/coupon-management',
      {
        coupons,
        layout: './layouts/adminLayout'
      }
    )
  },

  postCouponManagement: async (req, res) => {
    const couponDetails = req.body
    const couponCheck = await couponServices.checkCouponExists(couponDetails.coupon)
    if (couponCheck === null) {
      couponDetails.percentage = Number(couponDetails.percentage)
      couponDetails.minimumPrice = Number(couponDetails.minimumPrice)
      couponDetails.isoDate = new Date(couponDetails.expiryDate)
      couponDetails.users = []
      await couponServices.addNewCoupon(couponDetails)
      res.json(true)
    } else {
      res.json(false)
    }
  },

  deleteCoupon: async (req, res) => {
    const couponId = req.body.couponId
    await couponServices.deleteCouponById(couponId)
    res.json(true)
  },

  getSalesReport: async (req, res) => {
    let deliveredOrders

    if (req.query?.month) {
      const month = req.query?.month.split('-')
      const [yy, mm] = month
      deliveredOrders = await orderServices.queryDeliveredOrderList(yy, mm)
    } else if (req.query?.daterange) {
      const dateRange = req.query
      deliveredOrders = await orderServices.queryDeliveredOrderList(dateRange)
    } else {
      deliveredOrders = await orderServices.queryDeliveredOrderList()
    }

    let totalCouponDiscount = 0
    for (const order of deliveredOrders) {
      if (order.couponCode) {
        const couponDiscount = (order.price * order.couponPercentage) / 100
        order.couponDiscount = couponDiscount
        totalCouponDiscount += couponDiscount
      }
    }

    const total = deliveredOrders.reduce((acc, item) => acc + item.price, 0)
    const totalRevenue = total - totalCouponDiscount

    res.render('admin/sales-report',
      {
        total,
        totalCouponDiscount,
        totalRevenue,
        deliveredOrders,
        layout: './layouts/adminLayout'
      }
    )
  }
}
