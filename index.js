const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer")
const path = require("path")

dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

mongoose.connect(process.env.MONGO_DB_URL)
    .then(console.log('connected'))
    .catch((err) => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "File successfully uploaded",
        url: req.file.path
    })
})

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

app.listen("5000", () => {
    console.log("Backend Running...")
})
