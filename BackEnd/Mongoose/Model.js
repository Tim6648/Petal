const Mongoose = require("./Connect");
const { UsersScheMa, PhotoSchema } = require("./Schema")


const UsersModel = Mongoose.model("Users", UsersScheMa, "Users");
const PhotoModel = Mongoose.model("Photo", PhotoSchema, "Photo")


module.exports = {
    UsersModel,
    PhotoModel
}