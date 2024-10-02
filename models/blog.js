
const mongoose = require('mongoose')


const blogSchema = new mongoose.Schema({
    thumbnail_image: String,
    image_url: String,
    heading: String,
    description:Object
}, {timestamps: true})


module.exports = mongoose.model('Blog', blogSchema)
