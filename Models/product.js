const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    stock: Number,
    price: Number,
    saleStart: Date,
    saleEnd: Date
});

module.exports = mongoose.model('Product', productSchema);
