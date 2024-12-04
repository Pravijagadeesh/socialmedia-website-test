const express = require("express")
require("dotenv").config()
const apiRouter = require("./routes")
const connectDB = require("./DB Config/DB")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const {v2} = require("cloudinary")
const PORT = process.env.PORT || 4000
const app = express()
connectDB()
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())
app.use("/api",apiRouter)
app.listen(PORT, () => {
    console.log(`start port ${PORT}`)
})