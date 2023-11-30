const mongoose = require("mongoose");

//คือการสร้าง Model ที่เชื่อมโยงกับ Collection ที่มีชื่อ "User" ใน MongoDB
const User = mongoose.model( 
  "User",
  new mongoose.Schema({ // กำหนด Schema ของข้อมูลที่จะถูกบันทึกใน Collection. ในที่นี้, มี properties คือ
    username: String,
    email: String,
    password: String,
    roles: [
      { //กำหนด property "roles" เป็น array ที่เก็บ ObjectId ของเอกสารใน Collection "Role". นี่เป็นวิธีที่ Mongoose ให้การทำ Association ระหว่าง Collection โดยใช้ References
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User