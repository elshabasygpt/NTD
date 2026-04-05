const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    brand: { type: String, required: true }, // e.g., 'Borsching', 'Vika', 'KDD'
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    wholesalePrice: { type: Number, required: true },
    retailPrice: { type: Number },
    descriptionEn: { type: String },
    descriptionAr: { type: String },
    imageUrl: { type: String },
    typeEn: { type: String },
    typeAr: { type: String },
    positionEn: { type: String },
    positionAr: { type: String },
    oemRef: { type: String },
    warrantyEn: { type: String },
    warrantyAr: { type: String },
    originEn: { type: String },
    originAr: { type: String },
    vehicles: [{
        make: { type: String },
        model: { type: String },
        year: { type: String }
    }],
    isNew: { type: Boolean, default: false },
    isHot: { type: Boolean, default: false },
    isOE: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
