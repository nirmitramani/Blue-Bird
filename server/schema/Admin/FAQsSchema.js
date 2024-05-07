const mongoose = require('mongoose');

const FAQsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
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

module.exports = mongoose.model('faqs', FAQsSchema);
