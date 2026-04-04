const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    itemCount: { type: Number, required: true, default: 0 },
    reference: { type: String },
    status: { type: String, enum: ['Approved', 'Pending', 'Rejected', 'Completed'], default: 'Pending' },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer' }, // Optional linking
    items: [{
        sku: { type: String, required: true },
        nameEn: { type: String },
        nameAr: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
