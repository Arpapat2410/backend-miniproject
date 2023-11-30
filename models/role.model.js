const mongoose = require("mongoose");

//Model นี้จะถูกเชื่อมโยงกับ Collection ใน MongoDB ที่มีชื่อ "Role"
const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Role;