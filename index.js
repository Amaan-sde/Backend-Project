const express = require('express');

const app =express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.json());

const user = require("./router/user")

app.use("/api/v1", user);

app.listen(PORT , ()=>{
    console.log(`Server is at running at ${PORT}`)
})

const connectDB = require('./config/database');

connectDB();