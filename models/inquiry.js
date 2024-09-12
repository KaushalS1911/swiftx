
const mongoose = require('mongoose')


const inquirySchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    contact: String,
    subject: String,
    message: String,
}, {timestamps: true})


module.exports = mongoose.model('Inquiry', inquirySchema)


