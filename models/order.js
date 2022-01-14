const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const getSymbolFromCurrency = require('currency-symbol-map');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: objectId,
            required: true,
            ref: 'User'
        },
        address:{
            type: String,
            required: true,
        },
        orderId:{
            type: String, 
            required: true
        },
        paymentMethod:{
            type: String, 
            required: true
        },
        shop: {
            type: objectId,
            required: true,
            ref: 'Shop'
        },
        menu: {
            type: objectId,
            required: true,
            ref: 'Menu'
        },
        quantity:{
            type: Number,
            required: true,
            min: 0
        },
        total:{
            type: Number,
            required: true,
            min: 0
        },
        calorie:{
            type: Number, 
            required: true,
            min: 0
        },
        calorieUnit:{
            type: String,
            default: "gram"
        },
        currency:{
            type: String,
            default: getSymbolFromCurrency('GBP')
        },
        status:{
            type: String,
            enum:['Approved','Delivered', 'On-route','Waiting','Shop-Cancel'],
            default: 'Waiting'
        },
    },
    {
        timestamps: true,
    }
)

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;