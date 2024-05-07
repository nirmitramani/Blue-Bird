const mongoose = require('mongoose');

const PaymentDetailSchema = new mongoose.Schema({
   
    orderId: {
        type: String,
    },
    totalAmount: {    
        type: Number,
        required: true,
    },
    onlinPaymentId: {
        type: String,
    },
    onlineOrderId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pendding', 'Paid', 'Cancel'],
        required: true,
        default: 'Pendding'
    }
},
    { 
        timestamps: true ,
        versionKey: false
    }
);

module.exports = mongoose.model('payment_details', PaymentDetailSchema);
