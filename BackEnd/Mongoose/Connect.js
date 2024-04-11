const Mongoose = require("mongoose");
Mongoose.connect("mongodb://127.0.0.1:27017/3tPetal",function(err){
    if(err){
        console.log("数据库有误请联系管理员")
    }
})

module.exports = Mongoose;