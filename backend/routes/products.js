const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Local uploads folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all products (with optional filtering)
router.get('/', async (req, res) => {
    try {
        const { brand, category, search } = req.query;
        let query = {};
        
        if (brand) query.brand = brand;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { sku: { $regex: search, $options: 'i' } },
                { nameEn: { $regex: search, $options: 'i' } },
                { nameAr: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query);
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Single Product
router.get('/:sku', async (req, res) => {
    try {
        const product = await Product.findOne({ sku: req.params.sku });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({success: false, message: 'Not found'});
        res.json({ success: true, message: 'Deleted' });
    } catch(err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update Product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const data = req.body;
        if(req.file) {
            data.imageUrl = req.file.filename;
        }
        
        // Parse vehicles JSON if sent as string
        if(data.vehicles && typeof data.vehicles === 'string') {
            data.vehicles = JSON.parse(data.vehicles);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        if(!product) return res.status(404).json({success: false, message: 'Not found'});
        res.json({ success: true, data: product });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create Product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const data = req.body;
        if(req.file) {
            data.imageUrl = req.file.filename;
        }
        
        if(!data.sku || !data.nameEn || !data.price) {
            // Price mapping fallback if it's sent as wholesalePrice
            if(data.wholesalePrice) {
                // Good
            } else {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
        }
        
        // Parse vehicles
        if(data.vehicles && typeof data.vehicles === 'string') {
            data.vehicles = JSON.parse(data.vehicles);
        }

        const product = new Product(data);
        const saved = await product.save();
        res.status(201).json({ success: true, data: saved });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
