require("dotenv").config();
require("./db/mongoose")
const LocalStrategy = require("passport-local");
const passport = require("passport");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const campground = require('./routes/campground');
const comment = require("./routes/comments")
const index = require("./routes/index")
const User = require("./models/ruser")
const methodOverride = require("method-override")
const flash = require("connect-flash");





const port = process.env.port || 3000
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"))
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// MIDDLEWARE TO LOGIN
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");   //req.locals.nameOftheMessage = req.flash("name of the message in middleware")
    res.locals.success = req.flash("success"); 
    next()
});

app.use(index);
app.use(campground);
app.use(comment)
// app.use((req,res,next) =>{res.status(503).send("Site is current down.")})
app.listen(port, () =>{
    console.log("Server is on port "+port)
});