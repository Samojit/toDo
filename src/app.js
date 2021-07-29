const express = require('express')
const path =require('path')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const app = express()
port=5000
const hbs =require('hbs')
// const helpers = require('handlebars-helpers');
// const eq = helpers.eq();
const db = require('./db/conn')
// const db1 =require('./db/db')
// conts auth=require('./middleware/auth')
const reg =require('./models/model')
const Todo = require("./models/models");
// const autH =require('./middleware/auth')
// const index=require('../views/index')
const auth=require('./middleware/auth')


app.use(express.static('./public'))
const template_path=path.join(__dirname,"../templates/views")

const partials_path=path.join(__dirname,"../templates/partials")

  app.use(express.json())
  app.use(cookieParser())
  app.use(express.urlencoded({extended:false}))


app.set("view engine", "hbs")
// app.set("view engine", "ejs");
// app.set("views",tem_ejs)
app.set("views",template_path)

hbs.registerPartials(partials_path)

// app.get('/user',auth, function (req, res) {
//   reg.find({}, function(err, details){
//         if(err){
//             console.log('Error in fetching tasks from db');
//             return;
//         }
        
//         // var x=task[0]._id
//         // console.log(task)

//         return res.render('sectet', {
//             tittle: "secrect",
//             details: detalis
//         });
//     })

    
    
// });

const storage = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null,'./public/upload')
  },

  filename:function(req,file,callback){
    callback(null,Date.now() + file.originalname)
  }
})


const upload = multer({
  storage:storage,
  limits:{
    fieldSize:1024*1024*5
  }
})


app.get('/',auth,(req,res)=>{

  res.render("home")
  //   if(auth){
    
  // }
})



app.get('/register',(req,res)=>{
  res.render("register")
})
app.post('/register',upload.single('image'),async(req,res)=>{
  try {
    const password = req.body.password
    const cpassword=req.body.cpassword
    const email =req.body.email
    // console.log(email)
    // console.log(cpassword)
    if(password===cpassword){
      const newreg = new reg({
        username:req.body.name, 
        email:email,
        password:password,  
        cpassword:cpassword,
        // image:req.file.filename
      })
     

      const token = await newreg.genToken()
      res.cookie("jwt",token,{
        expires:new Date(Date.now()+ 30000),
        httpOnly:true
      })
      

      const registered=await newreg.save()
      res.status(201).render('login')
    }
    else{ 
       res.send("password not matching") 
    }
  } catch (err) {
    res.status(400).send(err)
  }  
})
app.get("/login", (req, res) => {
  res.render("login")
  
});
app.get("/update",auth,(req,res)=>{
  res.render('update',{
    username:req.user.username,
    users:req.user
  })
})


app.post("/login", async(req, res) => { 

  try {
    const email=req.body.email
    const password =req.body.password

   const UserName =await reg.findOne({email:email})
   const isMatch =bcrypt.compare(password,UserName.password)
   const token = await UserName.genToken()
   res.cookie("jwt",token,{
        expires:new Date(Date.now()+ 500000),
        httpOnly:true
      })

      console.log(` fetch the cookies value ${req.cookies.jwt}`)

   if(isMatch){
      // if(UserName.password === password){
    console.log("Okk")
    // document.getElementById("logout").disabled = true

    return res.redirect('/todo')
   }else{
     res.render('login',{
      //  message:"Sucess"
     })
   }
  //  res.send(UserName.password)
  //  console.log(UserName)

  } catch (error) {
    res.status(400).render('login',{
      message:'err'
    })
  }
});


  

// app.post('/user',auth,(req,res)=>{
  
//   res.render("user",{
//     username:req.user.username,
//     user:req.user
//   }) 
// })

app.get("/user", auth,(req, res) => {
  res.render("user",{
    username:req.user.username,
    user:req.user
  }) 
});

app.get('/logout',auth,async(req,res)=>{
  try {
    // console.log(req.user)

    req.user.tokens = req.user.tokens.filter((currentEleemnt)=>{
       return currentEleemnt.token != req.token
    })


    res.clearCookie("jwt")
    // res.render('toast')
    req.user.save()
    res.render("login")

  } catch (error) {
    res.status(400) 
  }
})

// app.listen(port,()=>{
//     console.log(`app is listing frpm port ${port}`)
// })




// app.use(express.static("./views/home"));

// app.use(express.urlencoded());
// app.set("view engine", "hbs");
// app.set("views", "./views");

app.get('/todo',auth,function(req, res){ 
  // if(req.search.query){ 
  //  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  // Todo.find({"description":regex},function(err,task,username,users){
  //   if(err){
  //     console.log(err)
  //   }
  //   return res.render('home',{
  //     task:task
  //   })
  // })

  // }
    Todo.find({user_id:req.user._id}, function(err, task,username,users){

 

        return res.render('home', {
            tittle: "Home",
            task: task,
            username:req.user.username,
            users:req.user
        });
    })         
})

app.post('/create-todo/',auth, function(req, res){
    // console.log(`id is ${auth._id}`)
    Todo.create({
        
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
        user_id:req.user._id
        
        }, function(err, newtask){
        if(err)
        {console.log('error in creating task', err); return;}

        return res.redirect('/todo');

    });
});

app.get('/delete-todo', function(req, res){

    var id = req.query;
    console.log(id)

    var count = Object.keys(id).length;
    for(let i=0; i < count ; i++){
      // let x=Object.keys(id)[i]
      // console.log(x)
        Todo.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back');
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
  }

  console.log(`Server is running on port : ${port}`);
});