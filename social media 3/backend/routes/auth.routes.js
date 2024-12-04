const { signupController, logoutController, loginController, getUser } = require("../controllers/auth.controllers")
const protectRoute = require("../middleware/protectroute")

const router = require("express").Router()

router.post("/v1/signup", signupController)
router.post("/v1/logout", logoutController)
router.post("/v1/login", loginController)
router.get("/getuser",protectRoute,getUser)

module.exports = router