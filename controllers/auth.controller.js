const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

// นำเข้าไลบรารี jsonwebtoken ซึ่งใช้สำหรับการสร้างและตรวจสอบ JSON Web Tokens (JWT) สำหรับกระบวนการลงชื่อเข้าใช้.
var jwt = require("jsonwebtoken"); 
// นำเข้าไลบรารี bcryptjs ซึ่งใช้สำหรับการเข้ารหัสและตรวจสอบรหัสผ่านโดยใช้วิธีการแบบ Salted Hashing
var bcrypt = require("bcryptjs");


exports.signup = async (req, res) => {
  try {
    //สร้างอ็อบเจกต์ User ใหม่จาก Model User ซึ่งคือ Model ที่เกี่ยวข้องกับ Collection "User" ใน MongoDB. มีการใส่ข้อมูลจาก req.body ที่ได้รับจากการส่งข้อมูลใน HTTP request
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), //เข้ารหัสรหัสผ่านที่ได้รับจาก req.body ด้วย bcryptjs โดยใช้ hashSync และการใส่ Salt ในระดับ 8
    });

    await user.save(); //บันทึกข้อมูลผู้ใช้ใหม่ลงในฐานข้อมูล MongoDB.

    // ตรวจสอบว่ามีการส่งข้อมูลบทบาทผู้ใช้มาหรือไม่ หากมี ค้นหาข้อมูลบทบาทใน Collection "Role"
    if (req.body.roles) {
      const roles = await Role.find({
        name: {
          $in: req.body.roles
        },
      });
      
      user.roles = roles.map((role) => role._id);
      await user.save();
    } else { // หากไม่มี กำหนดให้ผู้ใช้มีบทบาท "user" ที่กำหนดไว้
      const role = await Role.findOne({
        name: "user"
      });

      user.roles = [role._id];
      await user.save();
    }

    res.send({
      message: "User was registered successfully!"
    });
  } catch (err) {
    res.status(500).send({
      message: err
    });
  }
};


exports.signin = (req, res) => {
  User.findOne({ // ค้นหาผู้ใช้ที่มีชื่อผู้ใช้ที่ระบุใน req.body.username
      username: req.body.username
    })
    .populate("roles", "-__v") //ใช้ .populate() เพื่อดึงข้อมูลจาก Collection "Role" และให้มีการกระทำไม่เกินที่ข้อมูล "__v". นี่เป็นการทำ Inner Join ข้อมูลบทบาทเข้ากับผู้ใช้.
    .then(user => {
      if (!user) { 
        return res.status(404).send({
          message: "User Not found."
        });
      }
      // ตรวจสอบความถูกต้องของรหัสผ่านที่ระบุโดยใช้ bcrypt.compareSync
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ //เพื่อสร้าง token. Payload ประกอบด้วย id ของผู้ใช้
          id: user.id
        },
        config.secret, { //ใช้ secret key ที่ถูกนำเข้ามาจากไฟล์ config.js.
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // กำหนดระยะเวลามีผลของ token 24 hours
        });

      //  สร้าง array เพื่อเก็บข้อมูล role ของผู้ใช้
      var authorities = [];
      // วนลูปผ่าน array ของ role ที่ผู้ใช้มี
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};