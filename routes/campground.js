const express = require("express");
const router = express.Router();
const Campground = require("../models/rcamp");
const middlewareObj = require("../middleware/middleware")
const NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


router.get('/campgrounds', (req,res)=>{
    if(req.query.search){                           //req.query.search returns the info from the search box
        escapeRegex(req.query.search)
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name:regex}, function(err,camp){
            if(err){
                console.log(err);
            }else{
                res.render("campground/index", {camp, currentUser:req.user, page:"campgrounds"})
            }
        })
        
    }else{                           
        Campground.find({}, function(err,camp){
            if(err){
                console.log(err);
            }else{
                res.render("campground/index", {camp, currentUser:req.user, page:"campgrounds"})
            }
        })
    }
});

//add and Return to /campgrounds
//CREATE - add new campground to DB
router.post("/campgrounds", middlewareObj.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });

//New former for a campground
router.get('/campgrounds/new',middlewareObj.isLoggedIn ,(req, res)=>{
    res.render("campground/new")
});

// Show info about the campground
router.get('/campgrounds/:id', (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, found)=>{
        if(err || !found){
            req.flash("error","Campground not found")
            res.redirect("/campgrounds")
        }else{
            res.render('campground/show', {campground: found})
        }
    })
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middlewareObj.checkCampgroundOwnership,(req,res)=>{
    
    Campground.findById(req.params.id, (err, found)=>{
        res.render("campground/edit", {campground: found})
    })
});
// UPDATE CAMPGROUND ROUTE
// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

// DELETE CAMPGROUND
router.delete('/campgrounds/:id',middlewareObj.checkCampgroundOwnership,(req, res)=>{
    Campground.findByIdAndDelete(req.params.id, (err)=>{
        if (err){res.redirect("/campgrounds")}
        else{
            res.redirect("/campgrounds")
        }
    })
});



// https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router