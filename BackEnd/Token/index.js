const jwt = require("jsonwebtoken");

const JwtConfig = {
    secretKey: "jk123UU_s$@^#&*@^&*$",
    expiresIn:  24 * 60 * 60 // 单位为秒
}

function GenerateToken(uid) {
    const token = jwt.sign(
        {
            uid
        },
        JwtConfig.secretKey,
        {
            expiresIn:JwtConfig.expiresIn
        }
    )
    return token
}

function VerifyToken(token){
    try{
        return jwt.verify(token,JwtConfig.secretKey).uid
    }catch(err){
        return "token无效"
    }
}

module.exports = {
    GenerateToken,
    VerifyToken
}