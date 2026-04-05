const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB (Local)'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'NUTD Backend API is running' });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/dealers', require('./routes/dealers'));
app.use('/api/vehicles', require('./routes/vehicles'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
