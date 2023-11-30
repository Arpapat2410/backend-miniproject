const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //: กำหนดให้ Promise ใน Mongoose เป็น global Promise เพื่อให้สามารถใช้ Promise ได้ในโปรเจคทั้งหมด

const db = {}; //สร้างตัวแปร db เพื่อเก็บ object ที่มีทุกอย่าง

db.mongoose = mongoose; //เก็บ Mongoose instance ใน db object เพื่อให้สามารถเข้าถึง Mongoose ได้จากที่อื่น

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user", "admin", "moderator"]; //กำหนดค่า array ROLES ที่ระบุบทบาทที่มี

module.exports = db;