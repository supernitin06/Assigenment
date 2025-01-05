const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userrouter = require('./Routes/Userroutes');
const friendsrouter = require('./Routes/frndroutes');

app.use(cors());  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectToDb();


app.get('/', (req, res) => {
    res.send("Hello, World!");
});
app.use('/user',userrouter)
app.use('/friend',friendsrouter)

module.exports = app;
