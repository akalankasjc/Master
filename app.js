require('dotenv').config()
const express=require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));

  mongoose.connect('mongodb://127.0.0.1:27017/userDB');

  const userSchema=new mongoose.Schema({
    email:String,
    password:String
  });


  userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:['password'] });

  const User=new mongoose.model('User',userSchema);

  app.get('/',function(req,res){
    res.render("home");
  });

  app.get('/login',function(req,res){
    res.render("login",{login:"Login"},);
  });

  app.get('/register',function(req,res){
    res.render("register");
  });

  app.post('/register',function(req,res){
    const newUser=new User(
      {email:req.body.username,password:req.body.password});
      newUser.save()
      .then(function(response){
        res.render('secrets');
      })
      .catch(function(err){
        console.log(err);
      })
  });

  app.post('/login',function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    console.log(req.body);
    
    User.findOne({email:email})
    .then(function(user){
      
      if (user===null) {
        res.render('login', { login: 'Login Failed: Invalid email or password' });
      }else if(user.email===email && user.password===password){
        res.render('secrets');
      }else{
        res.render('login',{login:'Login Failed Try Again'});
      }
      
    }) 
      
    .catch(function(err){
      console.log(err);
    })
  });





  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
