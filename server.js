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

var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(
    cookieSession({
      name: "Arpapat-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: true
    })
  );

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

//routes
app.use('/api/products', productRoute)
require('./routes/auth.routes')(app);

app.get('/', (req, res) => {
    res.send("Hello NODE API")
})



mongoose.set("strictQuery", false)
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongooseDB');
        app.listen(5000, () => {
            console.log(`Node API app is running on port ${PORT}`);
            initial();
        });
    })
    .catch((error) => {
        console.log(error);
    });

    function initial() {
        Role.estimatedDocumentCount()
            .then(count => {
                console.log("Count of roles in the collection: " + count);
                if (count === 0) {
                    const rolesToCreate = [
                        { name: "user" },
                        { name: "moderator" },
                        { name: "admin" }
                    ];
    
                    return Promise.all(rolesToCreate.map(roleData => {
                        return new Role(roleData).save();
                    }));
                }
            })
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
    

    