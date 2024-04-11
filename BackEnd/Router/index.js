const express = require('express');
const Router = express.Router();


const { GenerateToken, VerifyToken } = require("../Token/index.js")
const uuid = require("node-uuid")
const { UsersModel, PhotoModel } = require("../Mongoose/Model.js");
const moment = require("moment");
const multer = require("multer")
const path = require('path');
const fs = require('fs')



const upload = multer({
    dest: path.join(__dirname, "../Static/Images")
})

Router.get("/Api/Login",
    (req, res) => {
        let AcCount = req.query.AcCount;
        let PassWord = req.query.PassWord;
        if (AcCount.length != 0 && PassWord.length != 0) {
            UsersModel.find({ AcCount, PassWord }, (err, doc) => {
                if (err) {
                    res.status(500).json({
                        msg: err
                    })
                    return;
                }
                if (doc.length != 0) {
                    res.status(200).json({
                        msg: "Login successful",
                        token: GenerateToken(doc[0]._id)
                    })
                } else {
                    res.status(200).json({
                        msg: "Login failed"
                    })
                }

            })
        } else {
            res.status(500).json({
                msg: "The parameter cannot be empty"
            })
        }


    }
)

Router.get("/Api/Register",
    (req, res) => {
        let AcCount = req.query.AcCount
        let UserName = req.query.UserName
        let PassWord = req.query.PassWord;

        const RegisterObj = {
            _id: uuid(),
            AcCount,
            UserName,
            PassWord
        }

        UsersModel.find({ AcCount }, (err, doc) => {
            if (err) {
                res.status(500).json({
                    msg: err
                })
            }
            if (doc.length != 0) {
                res.status(200).json({
                    msg: "The account has been occupied"
                })
            } else {
                UsersModel.create(RegisterObj, (err, doc) => {
                    if (err) {
                        res.status(500).json({
                            msg: err
                        })
                    }
                    res.status(200).json({
                        msg: "Registration is successful"
                    })
                })
            }
        })



    }
)

Router.get("/Api/SearchUserInfo", (req, res) => {
    let UserToken = req.headers.authorization;
    const _id = VerifyToken(UserToken);
    UsersModel.find({ _id }, (err, doc) => {
        if (err) {
            res.status(500).json({
                msg: err
            })
        }
        res.status(200).json({
            msg: {
                _id: doc[0]._id,
                UserName: doc[0].UserName
            }
        })
    })
})


Router.get("/Api/GetPhotoAllImages",
    (req, res) => {
        PhotoModel.find({},
            (err, doc) => {
                if (err) {
                    res.status(500).json({
                        msg: err
                    })
                }
                res.status(200).json({
                    msg: "success",
                    data: doc
                })
            }
        )
    }
)


Router.get("/Api/UserSendComments",
    (req, res) => {
        let UserCommectObj = req.query;
        UserCommectObj['Commect_Date'] = moment().format('YYYY-MM-DD HH:mm:ss');
        UserCommectObj['_id'] = uuid();
        PhotoModel.updateOne({ _id: UserCommectObj.Opus_id }, {
            $push: {
                Commect: UserCommectObj
            }
        }, (err, doc) => {
            if (err) {
                res.status(500).find({
                    msg: "Comment failed",
                    err
                })
            }
            if (doc.modifiedCount == 1) {
                res.status(200).json({
                    msg: "The review was successful"
                })
            }
        })
    }
)


Router.get("/Api/ThumbsUp",
    (req, res) => {
        let UserThumbsUpObj = req.query;
        let UserToken = req.headers.authorization;
        const _id = VerifyToken(UserToken);
        UserThumbsUpObj['User_Id'] = _id
 
        const userId = UserThumbsUpObj.User_Id;
        const opusId = UserThumbsUpObj.Opus_id;

  
        UsersModel.findOne({ _id: userId }, (err, existingDoc) => {
            if (err) {
                res.status(500).json({ msg: "The query failed" });
                return;
            }


            if (!existingDoc) {
                res.status(404).json({ msg: "The user does not exist" });
                return;
            }


            const isAlreadyLiked = existingDoc.LinkList && existingDoc.LinkList.some(item => item._id.toString() === opusId.toString());

            if (isAlreadyLiked) {
        
                UsersModel.updateOne(
                    { _id: userId, 'LinkList._id': opusId },
                    { $pull: { LinkList: { _id: opusId } } },
                    (err, doc) => {
                        if (err) {
                            res.status(500).json({ msg: "Failed to cancel like" });
                        } else {
                            res.status(200).json({ msg: "The cancellation of the like is successful" });
                            PhotoModel.find({ _id: opusId }, (err, doc) => {
                                let OpusStar = doc[0].Star;
                                OpusStar = OpusStar - 1
                                if (err) {
                                    return
                                }
                                PhotoModel.updateOne({ _id: opusId }, {
                                    $set: {
                                        Star: OpusStar
                                    }
                                }, (err, doc) => {

                                })
                            })

                        }
                    }
                );
            } else {
    
                UsersModel.updateOne(
                    { _id: userId },
                    { $push: { LinkList: { _id: opusId } } },
                    (err, doc) => {
                        if (err) {
                            res.status(500).json({ msg: "Failed to like" });
                        } else {
                            res.status(200).json({ msg: "Like success" });
                            PhotoModel.find({ _id: opusId }, (err, doc) => {
                                let OpusStar = doc[0].Star;
                                OpusStar = OpusStar + 1
                                if (err) {
                                    return
                                }
                                PhotoModel.updateOne({ _id: opusId }, {
                                    $set: {
                                        Star: OpusStar
                                    }
                                }, (err, doc) => {

                                })
                            })
                        }
                    }
                );
            }
        });
    }
)


Router.get("/Api/GetUserLikeList",
    (req, res) => {
        let UserToken = req.headers.authorization;
        const _id = VerifyToken(UserToken);
        UsersModel.find({ _id }, (err, doc) => {
            if (err) {
                res.status(500).json({
                    msg: err
                })
            }
            let LikeListArr = doc[0].LinkList
            res.status(200).json({
                msg: "Success",
                data: LikeListArr
            })
        })
    }
)


Router.post("/Api/PutFileImages", upload.single("file"), (req, res) => {
    let file = req.file;
    let Ext = file.originalname.split(".")[1];
    let OldName = file.path;
    let NewName = file.path + "." + Ext;
    fs.rename(OldName, NewName, function (err) {
        if (err) {
            res.status(500).json({
                err
            })
        }
        res.status(200).json({
            Msg: "File Upload Success",
            Img_Url: `http://127.0.0.1:3000/images/${file.filename}.${Ext}`
        })
    })
})

// 用户上传图片逻辑
Router.get("/Api/UploadData", (req, res) => {
    let UserUploadObj = req.query;
    UserUploadObj["UploadDate"] = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(UserUploadObj)
    PhotoModel.create(UserUploadObj,(err,doc) => {
        if(err){
            res.status(500).json({
                err
            })
        }
        res.status(201).json({
            msg:"The creation is successful"
        })
    })
})

module.exports = Router