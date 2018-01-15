const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/employeemanagement", {useMongoClient:true})


const Schema = mongoose.Schema;

const userSchema= new Schema({

    username: String,
    password: String
})

const user = mongoose.model("user",userSchema)
module.exports = user;