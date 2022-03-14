const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        desc: {
            type: String,
            required: true,
        },
        image_url: {
            type: String,
            required: false,
        },
        author_id: {
            type: String,
            required: true,
        },
        categories: {
            type: Array,
            required: false,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Post", PostSchema)
