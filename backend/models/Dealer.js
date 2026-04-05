const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    companyNameEn: { type: String, required: true },
    companyNameAr: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true }, // Should be hashed
    username: { type: String, unique: true, sparse: true },
    phone: { type: String },
    address: { type: String },
    region: { type: String },
    taxId: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    role: { type: String, default: 'dealer' },
    mapsUrl: { type: String },
    logoUrl: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dealer', dealerSchema);
