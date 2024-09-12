var express = require('express');
var router = express.Router();
const InquiryModel = require("../models/inquiry")
const NewsLetterModel = require("../models/newsletter")

router.post('/inquiry', async function(req, res) {

    const data = await InquiryModel.create(req.body)

    res.json({data, message: "Inquiry request added successfully", status: 201})
});

router.get('/inquiry', async function(req, res) {

    const data = await InquiryModel.find()

    res.json({data, status: 200})
});

router.post('/newsletter', async function(req, res) {

    const data = await NewsLetterModel.create(req.body)

    res.json({data, message: "Success", status: 201})
});

router.get('/newsletter', async function(req, res) {

    const data = await NewsLetterModel.find()

    res.json({data, status: 200})
});

module.exports = router;
