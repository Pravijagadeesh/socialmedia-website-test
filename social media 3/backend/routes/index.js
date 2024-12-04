const router = require("express").Router()
const authRouter = require("./auth.routes")
const userRouter = require("./user.routes")
const postRouter = require("./post.routes")
router.use("/auth",authRouter)
router.use("/user", userRouter)
router.use("/post", postRouter)

module.exports = router