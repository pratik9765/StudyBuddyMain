const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = (req,res) => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {console.log("Database connection successfull")})
    .catch((error) => {
        console.log("Error in connecting with database"),
        console.error(error),
        process.exit(1);
    })
};