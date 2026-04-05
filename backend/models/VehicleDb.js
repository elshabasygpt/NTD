const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    makeAr: { type: String },
    makeLogoUrl: { type: String },
    model: { type: String, required: true },
    modelAr: { type: String },
    modelImageUrl: { type: String },
    years: [{ type: String }] // e.g. ["2015", "2016", "2017", "2018-2023"]
}, { timestamps: true });

module.exports = mongoose.model('VehicleDb', vehicleSchema);
