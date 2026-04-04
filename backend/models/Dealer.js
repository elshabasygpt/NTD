const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    companyNameEn: { type: String, required: true },
    companyNameAr: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Should be hashed
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    role: { type: String, default: 'dealer' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dealer', dealerSchema);
