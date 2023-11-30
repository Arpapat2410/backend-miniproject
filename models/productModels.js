const mongoose = require('mongoose') //นำเข้าไลบรารี Mongoose เพื่อทำการเชื่อมต่อและจัดการ MongoDB 

const productSchema = mongoose.Schema( //Schema ระบุลักษณะและประเภทของข้อมูลที่จะถูกเก็บใน MongoDB.
    {
        name : { //คือ properties ของ Schema แต่ละ property มี type และ require
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
        //เป็น option ที่เพิ่ม timestamp ในแต่ละ document เมื่อถูกสร้างและแก้ไข
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
