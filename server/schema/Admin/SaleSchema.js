const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    saleimg: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true,
        default: 'Active'
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('sale', SaleSchema);
