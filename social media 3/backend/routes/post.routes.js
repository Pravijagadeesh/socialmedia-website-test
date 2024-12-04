const { createPost, commentPost, deletePost, likeAndDislike, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } = require("../controllers/post.controllers")
const protectRoute = require("../middleware/protectroute")

const router = require("express").Router()

router.post("/createpost", protectRoute, createPost)
router.post("/commentpost/:id", protectRoute, commentPost)
router.delete("/deletepost/:id", protectRoute, deletePost)
router.post("/likedislike/:id", protectRoute, likeAndDislike)
router.get("/getallposts", protectRoute, getAllPosts)
router.get("/getlikedpost/:id", protectRoute,getLikedPosts)
router.get("/getfollowingpost", protectRoute, getFollowingPosts)
router.get("/getuserpost/:id", protectRoute, getUserPosts)

module.exports = router