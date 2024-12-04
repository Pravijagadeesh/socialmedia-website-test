const PostModel = require("../models/post.model")
const notificationModel = require("../models/notification.model")
const UserModel = require("../models/user.models")
const {v2} = require("cloudinary")

const createPost = async(req,res) => {
    try{
        let {text, img} = req.body;
        const userId = req.user._id;
        const user = await UserModel.findById(userId)
        if(!user) {
            return res.status(400).json({error: "User not found"})
        }
        if(!text && !img) {
            const uploadedResponse = await v2.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new PostModel({
            user: userId,
            text,
            img,
        })
        await newPost.save()
        return res.status(200).json(newPost)
    }
    catch(error) {
        console.log(error.message)
    }
}

const commentPost = async(req,res) => {
    try{
        const postId = req.params.id;
        const {text} = req.body;
        const userId = req.user._id

        if(!text) {
            return res.status(400).json({error: "please enter the text"})
        }
        const post = await PostModel.findById(postId)
        if(!post) {
            return res.status(404).json({error: "post not found "})
        }
        const comment = {user: userId, text}
        post.comments.push(comment)
        await post.save()
        res.status(200).json(post)
    }
    catch(error) {
        console.log(error.message)
    }
}

const deletePost = async(req,res) => {
    try{
        const post = await PostModel.findById(req.params.id)
        if(!post) {
            return res.status(400).json({error: "Post not found"})
        } 
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not authorized to delete this post "})
        }
        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await v2.uploader.destroy(imgId)
        }
        await PostModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg: "post deleted successfully"})
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Internal server error"})
    }
}

const likeAndDislike = async(req,res) => {
    try{
       const userId = req.user._id;
       const { id: postId} = req.params;
       const post = await PostModel.findById(postId)
       if(!post) {
        return res.status(404).json({error: "Post not found"})
       }
       const userlikePost = post.likes.includes(userId)
       if(userlikePost) {
        await PostModel.updateOne({_id: postId}, 
            {$pull: { likes: userId}}
        )
        await UserModel.updateOne({_id: userId}, 
            {$pull: {likedPosts: postId}}
        )
        return res.status(200).json({msg: "Post unlike successfull"})
       }
       else {
        post.likes.push(userId)
        await post.save()
        const notification = await notificationModel({
            from: userId,
            to: post.user,
            type: "like",
        })
        await notification.save()
        await UserModel.updateOne(
            {_id: userId},
            {$push: {likedPosts: postId}}
        )
        await PostModel.updateOne({_id: postId},
            {$push: {likes: userId}}
        )
        return res.status(200).json({msg: "Post liked successfully"})
       }
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Internal server error"})
    }
}
const getAllPosts = async(req,res) => {
    try{
        const posts = await PostModel.find()
        .sort({ createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        })
        if(posts.length == 0) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    }
    catch(error) {
        console.log(error.message)
    }
}

const getLikedPosts = async (req,res) => {
    try{
        const userId = req.params.id;
        const user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({error: "User not found "})
        }
        const likedPosts = await PostModel.find({ _id: {$in: user.likedPost}})
        .populate({path: "user", select: "-password"})
        .populate({path: "comments.user", select: "-password"})
        return res.status(200).json(likedPosts)
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Internal server error"})
    }
}
const getFollowingPosts = async(req,res) => {
    try{
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        if(!user) {
            return res.status(404).json({error: "User not found "})
        }
        const following = user.following;
        const feedPosts = await PostModel.find({user: {$in: following}})
        .sort({
            createdAt: -1,
        })
        .populate({path: "user", select: "-password"})
        .populate({path: "comments.user", select: "-password"})
        return res.status(200).json(feedPosts)
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Intrenal server error "})
    }
}

const getUserPosts = async(req,res) => {
    try{
        const {userName} = req.params
        const user = await UserModel.find({userName})
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        const posts = await PostModel.find({ user: user._id})
        .sort({
            createdAt: -1
        })
        .populate({path: "user", select: "-password"})
        .populate({path: "comments.user", select: "-password"})
        return res.status(200).json(posts)
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Internal server error"})
    }
}
module.exports = {
    createPost,
    commentPost,
    deletePost,
    likeAndDislike,
    getAllPosts,
    getLikedPosts,
    getFollowingPosts,
    getLikedPosts,
    getUserPosts
}