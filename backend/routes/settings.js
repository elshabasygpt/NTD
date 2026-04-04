const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'setting-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all settings or a specific group
router.get('/', async (req, res) => {
    try {
        const settings = await Setting.find({});
        // Convert array of {key, value} to a single object map for easier frontend consumption
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json({ success: true, data: settingsMap });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Upload image setting
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Form the URL based on the uploaded file
    const url = 'http://localhost:5000/uploads/' + req.file.filename;
    res.json({ success: true, url: url });
});

// Bulk update settings
router.post('/bulk', async (req, res) => {
    try {
        const settingsObj = req.body; // Expects { key1: val1, key2: val2 }
        
        const updatePromises = Object.keys(settingsObj).map(async key => {
            return Setting.findOneAndUpdate(
                { key: key },
                { value: settingsObj[key] },
                { upsert: true, new: true }
            );
        });

        await Promise.all(updatePromises);
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Seed default settings
router.post('/seed', async (req, res) => {
    try {
        await Setting.deleteMany({});
        const defaults = [
            { key: 'contact_phone', value: '+20 123 456 7890' },
            { key: 'contact_email', value: 'support@nutd.com' },
            { key: 'hero_title_en', value: 'Premium Auto Parts Distributor' },
            { key: 'hero_title_ar', value: 'الموزع المعتمد لقطع غيار السيارات الفاخرة' },
            { key: 'hero_sub_en', value: 'Delivering top-tier OEM & Aftermarket components.' },
            { key: 'hero_sub_ar', value: 'نوفر أجزاء السيارات الأصلية وما بعد البيع بأعلى جودة للاعتماد عليها.' }
        ];
        await Setting.insertMany(defaults);
        res.json({ success: true, message: 'Seeded default settings' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
