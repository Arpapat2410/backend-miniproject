const express = require('express')
const Product = require('../models/productModels')
const {getProducts,getProduct,createProduct,updateProduct,deleteProduct} = require('../controllers/productController')

const router = express.Router()

//create product to DB
router.post('/',createProduct)

//getall product to DB
router.get('/' ,getProducts)

//get by ID product to DB
router.get('/:id' ,getProduct)

//update product to DB
router.put('/:id' ,updateProduct)

//delete by ID product to DB
router.delete('/:id' ,deleteProduct)

module.exports = router