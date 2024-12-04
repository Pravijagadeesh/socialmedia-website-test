const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.models")

const protectRoute = async(req,res,next) => {
    try{
        const token = req.cookies.token
    console.log(token)
    if(!token) {
        return res.json({error: "Invalid credentials", success: false})
    }
    const decodeToken = await jwt.verify(token, process.env.JWT_KEY)
    if(!decodeToken) {
        return res.json({error: "Invalid credentials",success: false})
    }
    const user = await UserModel.findById(decodeToken.userId)
    if(!user) {
        return res.json({error: "User not found", success: false})
    }
    req.user = user
    next()
    }
    catch(error) {
        console.log(error.message)
        return res.json({error: "Protect route error", success: false })
    }
}

module.exports = protectRoute