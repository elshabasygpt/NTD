const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'contact_phone', 'hero_title_en'
    value: { type: mongoose.Schema.Types.Mixed, required: true } // Can be string, object, array
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
