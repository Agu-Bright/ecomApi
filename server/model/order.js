const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String, 
            required: true
        },
        city: {
            type: String, 
            required: true
        },
        phoneNumber: {
            type: Number, 
            required: true
        },
        postalCode: {
            type: Number, 
            required: true
        },
        country: {
            type: String, 
            required: true
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: String,
            required: true
        },
        {
            quantity: Number,
            required: true
        },
        {
            image: String,
            required: true
        },
        {
            price: Number,
            required: true
        },

        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        }

    ],
    paymentInfo:{
        id: {
            type: string
        },
        status:{
            type: String
        }
    },
    paidAt:{
        type: Date
    },
    itemsPrice:{
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice:{
        type: Number,
        required: true,
        default: 0.0
    },
    shipingPrice:{
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus:{
        type: String,
        required: true,
        default: 'processing'
    },
    deliveredAt:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

const ORDER = new mongoose.model("order", orderSchema);
module.exports = ORDER;
