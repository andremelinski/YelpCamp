const express = require("express");
const router = express.Router();
const Comment = require("../models/comment")
const Campground = require("../models/rcamp");
const middlewareObj = require("../middleware/middleware")

router.post("/campgrounds/:id/comments", middlewareObj.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err,campground)=>{
        if (err || !req.params.id){
            req.flash("error", "Something went wrong");
            redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err) {
                        req.flash("error", "Something went wrong");
                        }
                else{
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "You added a new comment");
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
});

// Creating new comments from a specific post
router.get("/campgrounds/:id/comments/new",middlewareObj.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id, (err,campground)=>{
        if (err){
            console.log(err)
        }else{
            res.render("comments/new", {campground})
        }
    })
});
// EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middlewareObj.commentsOwnership, function(req, res){
    //If the campground id (req.params.id) is valid, check if exist a comment on the comment_id in Comment schema from the user, aloowed to go to the next stage
    Campground.findById(req.params.id, (err,foundCampground)=>{
        if(err || !foundCampground){
            req.flash("error", "Can not found that campground")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, (err, found)=>{
            if(err || !req.params.comment_id){
                req.flash("error", "Can not found that comment")
                res.redirect("back")
            }
            else{
                res.render("comments/edit",{campground_id : req.params.id, comment : found})
            }
        })
    })
    
});
// EDIT/UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id",middlewareObj.commentsOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatecomment)=>{
        if (err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});

// DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id",middlewareObj.commentsOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, req.body.comment, (err, deletecomment)=>{
        if (err){
            req.flash("error", "Something went wrong");
            res.redirect("back")
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});

module.exports = router