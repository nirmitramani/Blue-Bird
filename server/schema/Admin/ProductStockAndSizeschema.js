const mongoose = require('mongoose');

const productStockAndSizeschema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true,
        default: 'Active'
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('productStockSize', productStockAndSizeschema);