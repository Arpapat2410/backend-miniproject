const user = require('../models/user.model')

//SignUp
exports.signup = (req, res) => {
    //save user to DB
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    }).then(user => {
        if (req.body.role) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    },
                },
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({
                        message: "User was registered suxxessfully!"
                    });
                });
            });
        } else {
            //User roleid =1 (user)
            user.setRoles([1]).then(() => {
                res.send({
                    message: "User was registered suxxessfully!"
                });
            });
        }
    }).catch((err) => {
        res.state(500).send({
            message: "err.message"
        });
    });
}


