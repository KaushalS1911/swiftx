const express = require('express');
const router = express.Router();
const InquiryModel = require("../models/inquiry")
const GalleryModel = require("../models/gallery")
const BlogModel = require("../models/blog")
const NewsLetterModel = require("../models/newsletter")
const multer = require('multer')
const {uploadImageFile} = require("../helpers/images");
const {uploadThumbnailFile} = require("../helpers/images");
const {uploadGalleryImageFile} = require("../helpers/images");

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

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

router.post('/gallery', upload.fields([
    {name: 'gallery-image', maxCount: 1},
]), async function (req, res) {

    const image = req.files['gallery-image'] ? req.files['gallery-image'][0] : null;

    const galleryImage = image ? await uploadGalleryImageFile(image.buffer) : null;

    const data = await GalleryModel.create({image: galleryImage })

    return  res.status(201).json({data, message: "Success", status: 201})
});

router.get('/gallery', async function (req, res) {

    const data = await GalleryModel.find()

    return  res.status(200).json({data, message: "Success", status: 200})
});

router.put('/gallery/:id', upload.fields([
    {name: 'gallery-image', maxCount: 1},
]), async function (req, res) {

    const {id} = req.params;
    let payload = req.body;

    if (req.files && Object.keys(req.files).length > 0) {
        const image = req.files['gallery-image'] ? req.files['gallery-image'][0] : null;

        const galleryImage = image ? await uploadGalleryImageFile(image.buffer) : null;
        if (galleryImage) payload.image = galleryImage;
    }
    const updatedImage = await GalleryModel.findByIdAndUpdate(id, payload, {new: true});
    if (!updatedImage) {
        return res.status(404).json({error: "Image not found"});
    }

    return res.status(200).json({data: updatedImage, message: "Image updated successfully"})
});

router.delete('/gallery/:id', async function (req, res) {
    await GalleryModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: "Image deleted successfully"});
});

router.get('/blog', async function (req, res) {
    const data = await BlogModel.find()
    return  res.status(200).json({data, status: 200})
});

router.get('/blog/:id', async function (req, res) {
    const data =  await BlogModel.findById(req.params.id);
    return   res.status(200).json({data, status: 200})
});

router.post('/blog', upload.fields([
    {name: 'thumbnail-url', maxCount: 1},
    {name: 'image-url', maxCount: 1}
]), async function (req, res) {
    const {thumbnailUrl, imageUrl} = await handleFileUploads(req.files);
    const data = await BlogModel.create({...req.body, thumbnail_image: thumbnailUrl, image_url: imageUrl})

    return  res.status(201).json({data, message: "Success", status: 201})
});

router.put('/blog/:id', upload.fields([
    {name: 'thumbnail-url', maxCount: 1},
    {name: 'image-url', maxCount: 1}
]), async function (req, res) {

    const {id} = req.params;
    let payload = req.body;

    if (req.files && Object.keys(req.files).length > 0) {
        const {thumbnailUrl, imageUrl} = await handleFileUploads(req.files);
        if (thumbnailUrl) payload.thumbnail_image = thumbnailUrl;
        if (imageUrl) payload.image_url = imageUrl;
    }
    const updatedAsset = await BlogModel.findByIdAndUpdate(id, payload, {new: true});
    if (!updatedAsset) {
        return res.status(404).json({error: "Blog not found"});
    }

    return res.status(200).json({data: updatedAsset, message: "Blog updated successfully"})
});

router.delete('/blog/:id', async function (req, res) {
    await BlogModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: "Blog deleted successfully"});
});

async function handleFileUploads(files) {
    const thumbnailImage = files['thumbnail-url'] ? files['thumbnail-url'][0] : null;
    const image = files['image-url'] ? files['image-url'][0] : null;

    const thumbnailUrl = thumbnailImage ? await uploadThumbnailFile(thumbnailImage.buffer) : null;
    const imageUrl = image ? await uploadImageFile(image.buffer) : null;

    return {thumbnailUrl, imageUrl};
}


module.exports = router;
