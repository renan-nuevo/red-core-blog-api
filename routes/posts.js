const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (req.body.author_id && post.author_id === req.body.author_id) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                )
                res.status(200).json(updatedPost)
            }
            catch (err) {
                res.status(500).json(err)
            }
        }
        else {
            res.status(401).json({success: false, message: "Can't update this post."})
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.author_id === req.body.author_id) {
            try {
                await post.delete()
                console.log('deleted')
                res.status(200).json({success: true, message: "Post has been deleted successfully."})
            }
            catch (err) {
                res.status(500).json(err)
            }
        }
        else {
            res.status(401).json({success: false, message: "Can't delete this post."})
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get a specific post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get all posts
router.get("/", async (req, res) => {
    const username = req.query.user
    const catName = req.query.cat
    try {
        let posts
        if (username) {
            const user = await User.findOne({username})
            posts = await Post.find({ author_id: user._id })
        }
        else if (catName) {
            posts = await Post.find({
                categories: {
                $in: [catName],
                },
            })
        }
        else {
            posts = await Post.find()
        }
        res.status(200).json(posts)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
