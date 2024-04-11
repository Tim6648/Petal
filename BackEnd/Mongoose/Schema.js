const Mongoose = require("./Connect.js");

const UsersScheMa = Mongoose.Schema({
    _id:String,
    UserName:String,
    AcCount:String,
    PassWord:String,
    LinkList:Array,
    NoLinkLint:Array

})

const PhotoSchema= Mongoose.Schema({
    User_Id:String,
    ImagesUrl:String,
    UserName:String,
    Script:String,
    UploadDate:String,
    Star:Number,
    Commect:Array
})


module.exports = {
    UsersScheMa,
    PhotoSchema
}