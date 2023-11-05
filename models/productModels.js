const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name : {
            type : String,
            require : true
        },
        league : {
            type : String,
            require : true
        },
        type : {
            type : String,
            require : true
        },
        price : {
            type : Number,
            require : true
        }
        ,
        image : {
            type : String,
            require : false
        }
    },
    {
        //สร้างตารางเวลาที่ข้อมูลบันทึกกับอัพเดต
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
