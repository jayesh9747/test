require('dotenv').config();
const bodyParser = require("body-parser");
const express = require('express');
const cors = require("cors");

const { connectMongoDB } = require('./connection')
const auth = require('./routes/auth')
const app = express();
const PORT = process.env.PORT || 8001;


//middleware 
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

//routesA
app.use('/api/auth', auth);


app.get('/', async (req, res) => {
    res.json({ msg: "Hello world" })
})



connectMongoDB(process.env.MONGO_URI)
    .then(console.log("MongoDB Database is connected"))
    .catch((err) => {
        console.log("MongoDB err", err);
    })


app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
})