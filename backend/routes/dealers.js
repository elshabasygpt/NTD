const express = require('express');
const router = express.Router();
const Dealer = require('../models/Dealer');
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

// GET all dealers
router.get('/', async (req, res) => {
    try {
        const dealers = await Dealer.find().sort({ createdAt: -1 });
        res.json({ success: true, data: dealers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET a single dealer
router.get('/:id', async (req, res) => {
    try {
        const dealer = await Dealer.findById(req.params.id);
        if (!dealer) return res.status(404).json({ success: false, message: 'Dealer not found' });
        res.json({ success: true, data: dealer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update dealer status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }
        
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!dealer) {
            return res.status(404).json({ success: false, message: 'Dealer not found' });
        }
        res.json({ success: true, data: dealer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE a dealer
router.delete('/:id', async (req, res) => {
    try {
        const dealer = await Dealer.findByIdAndDelete(req.params.id);
        if (!dealer) {
            return res.status(404).json({ success: false, message: 'Dealer not found' });
        }
        res.json({ success: true, message: 'Dealer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create a dealer
router.post('/', upload.single('logo'), async (req, res) => {
    try {
        const { companyName, contactPerson, email, username, password, phone, address, region, status, mapsUrl } = req.body;
        
        let logoUrl = null;
        if (req.file) {
            logoUrl = `/uploads/${req.file.filename}`;
        }

        const newDealer = new Dealer({
            companyNameEn: companyName,
            companyNameAr: companyName,
            companyName,
            contactPerson,
            email,
            username,
            password: password || '123456', // Simple default for demo if not provided
            phone,
            address,
            region,
            mapsUrl,
            logoUrl,
            status: status || 'Approved'
        });
        await newDealer.save();
        res.status(201).json({ success: true, data: newDealer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST Login a dealer
router.post('/login', async (req, res) => {
    try {
        const { email, identifier, password } = req.body;
        const loginId = identifier || email;

        const dealer = await Dealer.findOne({
            $or: [
                { email: loginId },
                { phone: loginId },
                { username: loginId }
            ]
        });
        
        if (!dealer) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        if (dealer.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        if (dealer.status !== 'Approved') {
            return res.status(403).json({ success: false, message: 'Your account is not approved yet.' });
        }
        
        res.json({ success: true, data: dealer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update a dealer's own profile
router.put('/:id', upload.single('logo'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.logoUrl = `/uploads/${req.file.filename}`;
        }
        
        const dealer = await Dealer.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!dealer) {
            return res.status(404).json({ success: false, message: 'Dealer not found' });
        }
        res.json({ success: true, data: dealer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
