const Product = require('../models/productModels')

//getall product to DB
const getProducts =  async(req,res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) { 
        console.log((error.message));
        res.status(500).json({message : error.message})
    }
}

//get by ID product to DB
const getProduct =  async(req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) { 
        res.status(500).json({message : error.message})
    }
}

//create product to DB
const createProduct = async (req,res)=>{
    try{
        const product = await  Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log((error.message));
        res.status(500).json({message : error.message})
    }
}

//update product to DB
const updateProduct =  async(req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        //connot find any product in DB
        if (!product){
            return res.status(404).json({message : `connot find any product with ID ${id}`})
        }
        const updateProduct = await Product.findById(id)
        res.status(200).json(updateProduct)
    } catch (error) { 
        res.status(500).json({message : error.message})
    }
}

//delete by ID product to DB
const deleteProduct =  async(req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id)
        res.status(200).json(product)
    } catch (error) { 
        res.status(500).json({message : error.message})
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}