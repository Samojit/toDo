const jwt = require('jsonwebtoken')

const reg = require("../models/model")

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token,"mynameissamojitpaulthankyougoodmorning")
        console.log(verifyUser)
        const user =await reg.findOne({_id:verifyUser._id})
        req.token=token
        req.user=user
        console.log(user)
        next()
    } catch (error) {
        // res.render('toast')
        res.redirect('login')
    }
}

module.exports = auth;