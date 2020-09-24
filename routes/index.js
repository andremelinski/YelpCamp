const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/ruser");
const Campground = require("../models/rcamp");
const nodemailer = require("nodemailer");
const crypto = require("crypto")
const async = require("async")

//Intro page
router.get("/", function(req,res){
    res.render('intro')
});

// =================== AUTH ROUTES ============
// Show register
router.get("/register", function(req,res){
    res.render('register', {page:"register"})
});

//HANDLING SING UP LOGIC
router.post("/register", (req,res)=>{
    // new user
    const newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName:req.body.lastName,email: req.body.email ,avatar: req.body.avatar});

    User.register(newUser, req.body.password, (err, user)=>{
        if (err){
            req.flash("error", err.message);
            return res.render("register")
        }
        // authentication
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds")
        })
    })
});
// LOGIN
router.get("/login", (req,res)=>{
    res.render("login", {page:"login"})
});
// HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}));

// LOGOUT
router.get("/logout", (req,res)=>{
    req.logout()
    req.flash("success","You Logged out") //req.flash("key name", "message sended")
    res.redirect("/campgrounds")
});

//USER PROFILE 
router.get("/users/:id", async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const campground= await Campground.find().where("author.id").equals(user._id);
        if(!user){
            req.flash("error", "Something wrong");
                res.redirect("/");
        }
        else{   
                                     
            res.render("users/show",{user, campground})
        }                       
    }
    catch(e){
        res.status(500).send("ERROR")
    }
});

//FORGOT THE PASSWORD
router.get("/forgot", (req, res)=>{
    res.render("forgot");
    
});


module.exports = router
