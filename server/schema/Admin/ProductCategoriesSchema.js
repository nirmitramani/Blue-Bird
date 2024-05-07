const mongoose = require('mongoose');

const ProductCategoriesSchema = new mongoose.Schema({
    productcategoryimg: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true,
        default: 'Active'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'kids'],
        required: true
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

module.exports = mongoose.model('product_category', ProductCategoriesSchema);
