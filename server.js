require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const productRoute = require('./routes/productRoute')

const PORT = process.env.PPORT
const MONGO_URL = process.env.MONGO_URL

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//routes
app.use('/api/products',productRoute)

app.get('/', (req,res) =>{
    res.send("Hello NODE API")
})




mongoose.set("strictQuery", false)
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log('Connected to MongooseDB');
    app.listen(5000, () => {
        console.log("Node API app is running on port 5000");
    })
}) .catch ((error) => {
    console.log(error);
})