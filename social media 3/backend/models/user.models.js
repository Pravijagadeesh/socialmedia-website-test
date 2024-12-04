const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "users",
            default: [],
        }
    ],
    following: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "users",
            default: [],
        }
    ],
    profilePic: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    likedPost: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "posts"
        }
    ]
},
    {timestamps: true}
)

const UserModel = new mongoose.model("users", UserSchema)

module.exports = UserModel