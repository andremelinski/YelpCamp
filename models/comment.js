var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    raiting: {type: Number},
    createdAt: {type: Date, default: Date.now()},
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: { type: String }
    }
});
 
module.exports = mongoose.model("Comment", commentSchema);