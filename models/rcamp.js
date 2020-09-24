var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   author: {
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref:'User'
      },
      username: { type: String }
   },
   name: String,
   price: String,
   image: String,
   description: String,
   location:String,
   lat: Number,
   lng: Number,
   createdAt: {type: Date, default: Date.now()},
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);