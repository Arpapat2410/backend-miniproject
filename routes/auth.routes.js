const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  // Middleware ที่กำหนด header สำหรับการอนุญาตให้เรียก API จาก domain อื่น 
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

    // กำหนดเส้นทาง API สำหรับลงทะเบียนผู้ใช้
    app.post(
        "/api/auth/signup",
        [
          verifySignUp.checkDuplicateUsernameOrEmail,
          verifySignUp.checkRolesExisted
        ],
        controller.signup
      );
      
    // กำหนดเส้นทาง API สำหรับเข้าสู่ระบบ
    app.post("/api/auth/signin", controller.signin);

     // กำหนดเส้นทาง API สำหรับออกจากระบบ
    app.post("/api/auth/signout", controller.signout);
};

