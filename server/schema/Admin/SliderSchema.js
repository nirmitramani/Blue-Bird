const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    sliderimg: {
        type: String,
        required: true
    },
    title: {
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
        timestamps: true ,
        versionKey: false
    }
);

module.exports = mongoose.model('sliders', sliderSchema);
