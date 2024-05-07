const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortdescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryid: {
        type: String,
        required: true
    },
    productimg: {
        type: String,
        required: true
    },
    productthumbimg: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true,
        default: 'Active'
    },
    isnew: {
        type: String,
        required: true,
        default: 'Yes'
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('products', productSchema);