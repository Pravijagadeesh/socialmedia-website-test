const mongoose = require("mongoose")
const UserModel = require("./user.models")

const NotificationSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
    },
    type: {
        type: String,
        require: true,
        enum: ["follow","like"]
    },
    read: {
        type: Boolean,
        default: false,
    },

},
    {timstamps: true}
)

const notificationModel = new mongoose.model("notification", NotificationSchema)

module.exports = notificationModel