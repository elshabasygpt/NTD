const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.status) query.status = req.query.status;
        
        const orders = await Order.find(query).sort({ date: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { totalAmount, itemCount, reference, items } = req.body;
        // Generate random INVoice short ID for demo purposes
        const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const newOrder = new Order({
            invoiceNumber,
            totalAmount,
            itemCount,
            reference,
            status: 'Pending',
            items: items || []
        });
        
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, data: savedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update order
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body; // updated items array
        
        if (!items || !items.length) {
            return res.status(400).json({ success: false, error: 'Cannot save empty invoice.' });
        }

        // Recalculate totals on backend
        const subtotal = items.reduce((s, p) => s + (p.price * p.qty), 0);
        const tax = subtotal * 0.14;
        const totalAmount = Math.round(subtotal + tax);
        const itemCount = items.reduce((s, p) => s + p.qty, 0);

        const updatedOrder = await Order.findByIdAndUpdate(id, {
            items,
            totalAmount,
            itemCount,
            status: 'Pending'
        }, { new: true });

        if (!updatedOrder) return res.status(404).json({ success: false, error: 'Order not found' });
        
        res.json({ success: true, data: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update order status (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if(!['Approved', 'Rejected', 'Completed', 'Pending'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ success: false, error: 'Order not found' });
        
        res.json({ success: true, data: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Seed mock orders
router.post('/seed', async (req, res) => {
    try {
        await Order.deleteMany({});
        const mockOrders = [
            { invoiceNumber: 'INV-2025-018', date: new Date('2025-03-28'), itemCount: 5, reference: 'Ref-0012A', totalAmount: 12450, status: 'Approved', items: [] },
            { invoiceNumber: 'INV-2025-017', date: new Date('2025-03-25'), itemCount: 3, reference: '', totalAmount: 7200, status: 'Pending', items: [] },
            { invoiceNumber: 'INV-2025-016', date: new Date('2025-03-20'), itemCount: 8, reference: 'Q1-Restock', totalAmount: 28900, status: 'Approved', items: [] },
            { invoiceNumber: 'INV-2025-015', date: new Date('2025-03-15'), itemCount: 2, reference: '', totalAmount: 4100, status: 'Rejected', items: [] },
            { invoiceNumber: 'INV-2025-014', date: new Date('2025-03-05'), itemCount: 24, reference: 'Mega-Order', totalAmount: 112000, status: 'Completed', items: [] }
        ];
        const inserted = await Order.insertMany(mockOrders);
        res.status(201).json({ success: true, data: inserted });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
