const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.models")


const signupController = async(req,res) => {
    try{
        const{userName, fullName, email, password} = req.body;
        if(!userName, !fullName, !email, !password) {
            return res.json({error: "please fill the contents", success: false})
        }
        const existingUser = await UserModel.findOne({userName: userName})
        if(existingUser) {
            return res.json({error: "Username is already taken", success: false})
        }
        const existingEmail = await UserModel.findOne({email: email})
        if(existingEmail) {
            return res.json({error: "EmailId is already exists", success: false})
        }
        if(password.length < 8) {
            return res.json({error: "password must have atleast 8 characters", success:false})
        }
        const hassedPassword = bcrypt.hashSync(password, 8)
        const newUser = await UserModel.create({
            userName: userName,
            fullName: fullName,
            email: email,
            password: hassedPassword,
        })
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_KEY)
        console.log(token)

        return res
        .cookie("token", token)
        .status(200)
        .json({newUser,msg: "Account created successfull", success: true})
    }
    catch(error) {
        console.log(err.message)
        throw error
    }
}

const loginController = async(req,res) => {
    try{
        const {email, password} = req.body;
        if(!email, !password) {
            return res.json({error: "Please enter the all contents", success: false})
        }
        const user = await UserModel.findOne({email}) 
        if(!user) {
            return res.json({error: "EmailId is not found", success: false})
        }
        const verifyPassword = bcrypt.compareSync(password, user.password)
        if(!verifyPassword) {
            return res.json({error: "password is incorrect", success: false})
        }
        const token = jwt.sign({userId: user._id},process.env.JWT_KEY)
        
        return res
        .cookie("token", token)
        .status(200)
        .json({user,msg: "Account login successfull", success: true})
    }
    catch(error) {
        console.log(error.message)
        return res.json({error: "internal server error", success: false})
    }
}

const logoutController = async(req,res) => {
    try{
        res
        .clearCookie("token")
        .status(200)
        .json({msg: "account loggedout successfull", success: true})
    }
    catch(error) {
        console.log(error.message)
        return res.json({error: "internal server error", success: false})
    }
}

const getUser = async(req,res) => {
    try{
        const user = await UserModel.findById(req.user._id).select("-password")
        return res
        .status(200)
        .json({msg: user, success: true})
    }
    catch(error) {
        console.log(error.message)
    }
}

module.exports = {
    signupController,
    loginController,
    logoutController,
    getUser
}