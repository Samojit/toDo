
const express = require('express')
const app = express()
const mongoose=require('mongoose')

DB="mongodb+srv://Samo:Samo12345@cluster0.mxohz.mongodb.net/toDo?retryWrites=true&w=majority"



const conn= mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false

}).then(()=>{
    console.log("Connection Successful")
}).catch((err)=>{
console.log("Connection not Successful")
console.log(err)
});

module.exports = conn;