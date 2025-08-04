const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = () =>{
    mongoose.connect(process.env.DATABASE_URL)

    .then(()=>{
        console.log("Database Connected");
    })

    .catch((err)=>{
        console.error(err);
        console.log("Not Connected");
        process.exit(1);
    })
}

module.exports = connectDB;