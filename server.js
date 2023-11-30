require('dotenv').config()
const cookieSession = require("cookie-session");
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const productRoute = require('./routes/productRoute')
var cors = require('cors')
const db = require("./models");
const Role = db.role;


const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND

//CORS เป็นกลไกที่ใช้ในการควบคุมการเข้าถึงทรัพยากรที่ตั้งอยู่ในโดเมนอื่น ๆ
var corsOptions = {
    //ระบุโดเมนของเว็บไซต์ที่ได้รับอนุญาตให้เข้าถึง
    origin: FRONTEND,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//การใช้ middleware ใน Express.js เพื่อตั้งค่าการใช้งาน Cookie Session ในแอปพลิเคชัน
app.use(
    cookieSession({
      name: "Arpapat-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: true //กำหนดคุกกี้ในทางที่ทำให้เข้าถึงได้เฉพาะผ่าน HTTP เท่านั้น
    })
);

app.use(cors(corsOptions)) //middleware cors เพื่อเปิดให้ทรัพยากรบนเซิร์ฟเวอร์ของคุณสามารถเรียกใช้ได้จากโดเมนอื่น ๆ
app.use(express.json()) // ใช้ middleware express.json() เพื่อให้ Express สามารถประมวลผลข้อมูล JSON ที่ถูกส่งมาใน request body
app.use(express.urlencoded({ //เพื่อให้ Express สามารถประมวลผลข้อมูลที่ถูกส่งมาในรูปแบบของ URL-encoded data ใน request body
    extended: false
}))

//routes
app.use('/api/products', productRoute)
require('./routes/auth.routes')(app);

app.get('/', (req, res) => {
    res.send("Hello NODE API")
})


//คำสั่งนี้กำหนดค่าใน Mongoose เพื่อปิดการใช้งาน strict query mode. strict query mode
mongoose.set("strictQuery", false)
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongooseDB');
        app.listen(5000, () => {
            console.log(`Node API app is running on port ${PORT}`);
            initial(); //ฟังก์ชัน initial ที่ถูกเรียกเพื่อทำงานต่างๆ เมื่อแอปพลิเคชันเริ่มต้น
        });
    })
    .catch((error) => {
        console.log(error);
    });

    function initial() {
        Role.estimatedDocumentCount() //ใช้ Mongoose ฟังก์ชัน estimatedDocumentCount() เพื่อนับจำนวนเอกสารทั้งหมดในคอลเล็กชัน Role
            .then(count => {
                console.log("Count of roles in the collection: " + count);
                if (count === 0) { 
                    const rolesToCreate = [ //กำหนดข้อมูลเริ่มต้นสำหรับ roles ที่ต้องการสร้าง
                        { name: "user" },
                        { name: "moderator" },
                        { name: "admin" }
                    ];

                    //เพื่อสร้าง promises สำหรับการบันทึกข้อมูล roles ทั้งหมดที่ต้องการสร้าง และคืน promise ทั้งหมด
                    return Promise.all(rolesToCreate.map(roleData => { 
                        return new Role(roleData).save();
                    }));
                }
            })
            //เมื่อการบันทึกเสร็จสมบูรณ์, จะมีการใช้ .then() เพื่อตรวจสอบผลลัพธ์และแสดงข้อความใน console
            .then(results => {
                if (results) {
                    results.forEach(result => {
                        console.log(`Added '${result.name}' to roles collection`);
                    });
                }
            })
            .catch(err => {
                console.error("Error initializing roles", err);
            });
    }
    

    