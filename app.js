//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const asyncHandler = require("express-async-handler");
const app = express();
app.use(express.static("partials"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret:"askdjskkeksikwkdiskrusig",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    search: String,
    DOB: String,
    Hostels_Stayed: String,
    about_me: String,
    Name: String,
    department: String,
    about: String,
    nickname: String,
    first_thing: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});
app.get("/search", function(req, res){
    if(req.isAuthenticated()){
        res.render("search");
    } else{
        res.redirect("/login");
    }
})
app.get("/profile",function(req, res){
    if (req.isAuthenticated()){
        res.render("profile");
    } else {
        res.redirect("/login");
    }
});
app.get("/profile1",function(req, res){
    if (req.isAuthenticated()){
        res.render("profile1");
    } else {
        res.redirect("/login");
    }
});
app.get("/userprofile", function(req,res){
    if (req.isAuthenticated()){
        res.render("userprofile");
    }
    else{
        res.redirect("/login");
    }
});
app.get('/profile1', function(req, res){
    if (req.isAuthenticated()){
        res.render("profile1")
    }else{
        res.redirect("/login")
    }
});
app.post("/search", function(req,res){
    const user = asyncHandler(async (req,res)=>{
        const users = await User.find()
        res.render("userprofile").json(users)
    });
});
app.post("/register", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/profile");
            });
        }
    });
});
app.post("/login", function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/profile1");
            });
        }
    });
});
app.listen(3000, function(req,res){
    console.log("site started working");
});
