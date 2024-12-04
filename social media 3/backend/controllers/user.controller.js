const UserModel = require("../models/user.models")
const bcrypt = require("bcrypt")
const notificationModel = require("../models/notification.model")
const {v2} = require("cloudinary")

const profileController = async(req,res) => {
    try{
        const {userName} = req.params;
        const user = await UserModel.findOne({userName })
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        return res.status(200).json(user)
    }
    catch(error) {
        console.log(error.message)
    }
}

const followAndUnfollow = async(req,res) => {
    try{
        const {id} = req.params;
        console.log(id)
        const modifyByOther = await UserModel.findById(id)
        console.log(modifyByOther)
        const currentUser = await UserModel.findById(req.user._id)
        console.log(currentUser)
        
        if(id == req.user._id) {
            return res.status(404).json({error: "You can't follow/unfollow yourself"})
        }
        if(!currentUser || !modifyByOther) {
            return res.status(404).json({error: "user not found"})
        }
        
        const isFollowing = currentUser.following.includes(id)
        const newNotification = new notificationModel({
            type: "follow",
            from: req.user._id,
            to: modifyByOther._id
        })
        await newNotification.save()
        if(isFollowing) {
            await UserModel.findByIdAndUpdate(id,{
                $pull: {followers: req.user._id}
            })
            await UserModel.findByIdAndUpdate(req.user._id,{
                $pull: {following: id}
            })
            return res.json({msg: "user unfollowed sucessfully"})
        }
        else {
            await UserModel.findByIdAndUpdate(id,{
                $push: {followers: req.user._id}
            })
            await UserModel.findByIdAndUpdate(req.user._id,{
                $push: {following: id}
            })
            return res.json({msg: "User followed successfully"})
        }
    }
    catch(error) {
        console.log(error.message)
    }
}

const suggestUsers = async(req,res) => {
    try{
        const userId = req.user._id;
        const userFollowedByMe = await UserModel.findById(userId).select("following")
        
        const users = await UserModel.aggregate([
            {
                $match: {
                    _id: {$ne: userId}
                },
            },
            {
                $sample: {
                    size:10
                }
            }
        ])

        const filterUsers = users.filter(user => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filterUsers.slice(0 , 5)
        suggestedUsers.forEach(user => user.password = null)

        return res.status(200).json({msg: suggestedUsers})
    }
    catch(error) {
        console.log(error.message)
        
    }
}

const updateUsers = async(req,res) => {
    try{
        let {userName, fullName, email, currentPassword, newPassword, bio, link} = req.body;
        let {profilePic, coverImg} = req.body;

        const userId = req.user._id
        let user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({error: "user not found"})
        }
        if(!newPassword || !currentPassword) {
            return res.status(404).json({error: "please provide both current password and new password"})
        }
        if(newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) {
                return res.status(400).json({error: "Current password is incorrrect"})
            }
            if(newPassword.length > 8){
                return res.status(400).json({error: "please enter 8 or more characters"})
            }
            user.password = await bcrypt.hashSync(newPassword, 8 )
            if(profilePic){
                if(user.profilePic){
                    await v2.uploader.destroy(
                        user.profilePic.split("/").split(".")[0]
                    )
                }
                const uploadUrl = await v2.uploader.upload(profilePic)
                profilePic = uploadUrl.secure_url
            }
            if(coverImg){
                if(user.coverImg) {
                    await v2.uploader.destroy(
                        user.coverImg.split("/").split(".")[0]
                    )
                }
                const uploadUrl2 = await v2.uploader.upload(coverImg)
                coverImg = uploadUrl2.secure_url
            }
            user.userName = userName || user.fullName
            user.fullName = fullName || user.fullName
            user.email = email || user.email
            user.bio = bio || user.bio
            user.link = link || user.link
            user.profilePic = profilePic || user.profilePic
            user.coverImg = coverImg || user.coverImg

            await user.save()
            user.password = null
            return res.json({msg: "working", user})
        }
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Internal server error"})
    }
} 

module.exports = {
    profileController,
    followAndUnfollow,
    suggestUsers,
    updateUsers
}