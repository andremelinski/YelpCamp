let middlewareObj={};
const Campground = require("../models/rcamp");
const Comment = require("../models/comment")
const flash = require("connect-flash");

//CHECK CAMPGROUND OWNERSHIP --> AUTORIZATION
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, found)=>{
            
            if (err){res.redirect("back")
                    req.flash("error", "Campground not found")}
            else{
                //Does the user own the campground?
                if(found.author.id.equals(req.user._id)){
                    // if matches go to the next stage
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }

        })
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//CHECK COMMENTS OWNERSHIP --> AUTORIZATION
middlewareObj.commentsOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, found)=>{
            if (err || !found){
                    req.flash("error", "Comment  not found");
                    res.redirect("back")
                }
            else{
                //Does the user own the campground?
                if(found.author.id.equals(req.user._id)){
                    // if matches go to the next stage
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }

        })
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
// MIDDLEWARE
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }req.flash("error", "You need to be login to do that")
    req.flash("success", "Welcome!")
    res.redirect("/login")
}

module.exports = middlewareObj;