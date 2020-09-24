const mongoose = require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true, lowercase: true},
    lastName : {type: String, required: true, trim: true, lowercase: true},
    email : {type: String, required: true, trim: true, lowercase: true, unique:true},
    avatar: String,
    username: {type: String},
    password: {type: String, trim: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);