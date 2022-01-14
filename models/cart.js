const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: objectId,
            required: true,
            ref: 'User'
        },
        menu:{
            type: objectId,
            required: true,
            ref: 'Menu'
        },
        quantity:{
            type: Number,
            required: true,
            min: 0
        },
        amount:{
            type: Number,
            required: true,
            min:0
        }
    },
    {
        timestamps: true,
    }
)

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart