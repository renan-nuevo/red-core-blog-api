const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })

        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        if(err.code = '11000') {
            res.status(409).json({
                sucess: false,
                message: 'User already exists.'
            })
        }
        else {
            res.status(500).json(err)
        }
    }
    return
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if(!user) {
            res.status(400).json({
                sucess: false,
                message: "Invalid user credentials"
            })
        } 

        const validated = await bcrypt.compare(req.body.password, user.password)
        if(!validated) { 
            res.status(400).json({
                sucess: false,
                message: "Invalid user credentials"
            })
        }
        const { password, ...others } = user._doc
        res.status(200).json(others)
    }
    catch (err) {
        res.status(500).json(err)
    }
    return
})

module.exports = router
