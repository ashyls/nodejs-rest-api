const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
});

module.exports = mongoose.model('products', productSchema);