const { profileController, followAndUnfollow, suggestUsers, updateUsers } = require("../controllers/user.controller")
const protectRoute = require("../middleware/protectroute")

const router = require("express").Router()

router.get("/profile/:userName",protectRoute,profileController)
router.post("/follow/:id", protectRoute, followAndUnfollow)
router.post("/suggest", protectRoute, suggestUsers)
router.put("/update", protectRoute, updateUsers)

module.exports = router