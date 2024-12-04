const mongoose = require("mongoose")

const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO)
        console.log(`mongoose connect ${connect.connection.host}`)
    }
    catch(err) {
        console.log(err.message)
    }
}

module.exports = connectDB