const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")

// edit a user
router.put("/:id", async (req, res) => {
    if (req.body._id === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            )
            res.status(200).json(updatedUser)
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(401).json({ success: false, message: "Can't update this account" })
    }
})

// delete a user
router.delete("/:id", async (req, res) => {
    if (req.body._id === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username })
                await User.findByIdAndDelete(req.params.id)
                res.status(204).json({ success: true, message: "User has been deleted" })
            }
            catch (err) {
                res.status(500).json(err)
            }
        }
        catch (err) {
            res.status(404).json({ success: false, message: "User not found" })
        }
    }
    else {
        res.status(401).json({ success: false, message: "You can't delete this account" })
    }
})

// fetch a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
