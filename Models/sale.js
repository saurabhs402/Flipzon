const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    startTime: Date,
    endTime: Date,
});

module.exports = mongoose.model('Sale', saleSchema);
