const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileimg: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    postcode: {
        type: String,
    },
    token: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true,
        default: 'Active'
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('users', UserSchema);
