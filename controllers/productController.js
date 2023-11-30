const Product = require('../models/productModels')

//getall product to DB
const getProducts =  async(req,res) => {
    try {
        // ในบล็อก try ทำการดึงข้อมูลสินค้าจากฐานข้อมูล
        const products = await Product.find({})
        // ส่งข้อมูลสินค้ากลับไปยัง client ด้วยสถานะ HTTP 200
        res.status(200).json(products)
    } catch (error) { 
        // ในกรณีที่เกิดข้อผิดพลาดในการดึงข้อมูล
        console.log((error.message));
        // ส่งข้อความข้อผิดพลาดกลับไปยัง client พร้อมกับสถานะ HTTP 500 (Internal Server Error)
        res.status(500).json({message : error.message})
    }
}

//get by ID product to DB
const getProduct =  async(req,res) => {
    try {
        // ดึงค่า id จาก parameters ของ request
        const {id} = req.params
        // ในบล็อก try ทำการดึงข้อมูลสินค้าจากฐานข้อมูลด้วย id
        const product = await Product.findById(id)
        // ส่งข้อมูลสินค้ากลับไปยัง client ด้วยสถานะ HTTP 200
        res.status(200).json(product)
    } catch (error) { 
        console.log((error.message));
        res.status(500).json({message : error.message})
    }
}

//create product to DB
const createProduct = async (req,res)=>{
    try{
        // ในบล็อก try ทำการสร้างสินค้าใหม่ในฐานข้อมูล
        const product = await  Product.create(req.body)
        // ส่งข้อมูลสินค้าที่ถูกสร้างกลับไปยัง client ด้วยสถานะ HTTP 200
        res.status(200).json(product)
    } catch (error) {
        console.log((error.message));
        res.status(500).json({message : error.message})
    }
}

//update product to DB
const updateProduct =  async(req,res) => {
    try {
        // ดึงค่า id จาก parameters ของ request
        const {id} = req.params
        // ในบล็อก try ทำการอัปเดตข้อมูลสินค้าในฐานข้อมูล
        const product = await Product.findByIdAndUpdate(id, req.body)
        //connot find any product in DB
        if (!product){
            return res.status(404).json({message : `connot find any product with ID ${id}`})
        }
        // ดึงข้อมูลสินค้าที่ถูกอัปเดตจากฐานข้อมูล
        const updateProduct = await Product.findById(id)
        res.status(200).json(updateProduct)
    } catch (error) { 
        res.status(500).json({message : error.message})
    }
}

//delete by ID product to DB
const deleteProduct =  async(req,res) => {
    try {
        // ดึงค่า id จาก parameters ของ request
        const {id} = req.params
        // ในบล็อก try, ทำการลบข้อมูลสินค้าในฐานข้อมูล
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