const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        required: true,
        default: 'Pending'
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('contact_us', ContactUsSchema);
