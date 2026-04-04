const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Article = require('../models/Article');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'article-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// GET All Articles
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = { isPublished: true };
        
        if (category && category !== 'All') {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { titleEn: { $regex: search, $options: 'i' } },
                { titleAr: { $regex: search, $options: 'i' } }
            ];
        }

        const articles = await Article.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// GET All Articles for Admin (including unpublished)
router.get('/admin', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// GET Single Article by Slug
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
        
        // increment views
        article.views += 1;
        await article.save();
        
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// CREATE Article (Admin)
router.post('/', async (req, res) => {
    try {
        const newArt = new Article(req.body);
        await newArt.save();
        res.status(201).json({ success: true, data: newArt });
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ success: false, error: 'Slug must be unique' });
        res.status(500).json({ success: false, error: error.message });
    }
});

// UPDATE Article (Admin)
router.put('/:id', async (req, res) => {
    try {
        const art = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!art) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true, data: art });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE Article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// UPLOAD Thumbnail
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});

// UPLOAD Video
router.post('/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
    }
    const videoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ success: true, url: videoUrl });
});

module.exports = router;
