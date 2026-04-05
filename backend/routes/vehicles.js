const express = require('express');
const router = express.Router();
const VehicleDb = require('../models/VehicleDb');
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
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all makes/models
router.get('/', async (req, res) => {
    try {
        const vehicles = await VehicleDb.find().sort({ make: 1, model: 1 });
        res.json({ success: true, data: vehicles });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new vehicle entry
router.post('/', upload.fields([{ name: 'makeLogo', maxCount: 1 }, { name: 'modelImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { make, makeAr, model, modelAr, years } = req.body;
        
        let makeLogoUrl = '';
        let modelImageUrl = '';
        
        if (req.files && req.files['makeLogo']) {
            makeLogoUrl = '/uploads/' + req.files['makeLogo'][0].filename;
        }
        if (req.files && req.files['modelImage']) {
            modelImageUrl = '/uploads/' + req.files['modelImage'][0].filename;
        }

        // Years might come as JSON string from FormData
        let parsedYears = [];
        if (years) {
            try {
                parsedYears = JSON.parse(years);
            } catch(e) {
                // if it's a comma separated string or array
                if (Array.isArray(years)) parsedYears = years;
                else parsedYears = years.split(',').map(y => y.trim());
            }
        }

        const newVehicle = await VehicleDb.create({ 
            make, 
            makeAr,
            model, 
            modelAr,
            years: parsedYears,
            makeLogoUrl,
            modelImageUrl
        });
        res.status(201).json({ success: true, data: newVehicle });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update vehicle entry
router.put('/:id', upload.fields([{ name: 'makeLogo', maxCount: 1 }, { name: 'modelImage', maxCount: 1 }]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (updateData.years && typeof updateData.years === 'string') {
            try {
                updateData.years = JSON.parse(updateData.years);
            } catch(e) {
                updateData.years = updateData.years.split(',').map(y => y.trim());
            }
        }

        if (req.files && req.files['makeLogo']) {
            updateData.makeLogoUrl = '/uploads/' + req.files['makeLogo'][0].filename;
        }
        if (req.files && req.files['modelImage']) {
            updateData.modelImageUrl = '/uploads/' + req.files['modelImage'][0].filename;
        }

        const updated = await VehicleDb.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, data: updated });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete vehicle entry
router.delete('/:id', async (req, res) => {
    try {
        await VehicleDb.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Seed default dataset (optional)
router.post('/seed', async (req, res) => {
    try {
        await VehicleDb.deleteMany();
        const seeds = [
            { make: 'Volkswagen', model: 'Golf', years: ['2015', '2016', '2017', '2018'] },
            { make: 'Volkswagen', model: 'Passat', years: ['2017', '2018', '2019', '2020'] },
            { make: 'Audi', model: 'A3', years: ['2018', '2019', '2020'] },
            { make: 'Skoda', model: 'Octavia', years: ['2019', '2020', '2021'] },
            { make: 'Skoda', model: 'Superb', years: ['2020', '2021', '2022'] }
        ];
        await VehicleDb.insertMany(seeds);
        res.json({ success: true, message: 'Seeded' });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
