const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('mongoose-type-email');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator');

// app.use(express.json())
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}
const regSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email:{
        type:String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
    //     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    image:String,
});
regSchema.methods.genToken = async function(next){
    try {
        const token = jwt.sign({_id:this._id.toString()},"mynameissamojitpaulthankyougoodmorning")
        this.tokens = this.tokens.concat({token:token})
        await this.save()

        // console.log(token)
        return(token)
    } catch (error) {
        res.send("error")        
    }
    next()

}

regSchema.pre("save",async function(next){

    if(this.isModified("password")){
        // const passwordHash =await bcrypt.hash(password,10)
    this.password=await bcrypt.hash(this.password,10)
    this.cpassword = await bcrypt.hash(this.password,10)
    }
    
    next()
})

const reg = new mongoose.model('reg', regSchema);

module.exports = reg;