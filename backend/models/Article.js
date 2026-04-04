const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerptEn: { type: String },
    excerptAr: { type: String },
    contentEn: { type: String, required: true },
    contentAr: { type: String, required: true },
    category: { type: String, required: true, enum: ['News', 'Campaigns', 'Events', 'Store Visits'] },
    thumbnail: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
