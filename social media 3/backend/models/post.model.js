const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    text: String,
    img: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true,
            }
        }
    ]
},
    {timestamps: true}
)

const PostModel = new mongoose.model("posts", PostSchema)

module.exports = PostModel