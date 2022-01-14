const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const getSymbolFromCurrency = require('currency-symbol-map')

const assestSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    fieldName: {
        type: String,
        required: true
    },
    default: {
        type: Boolean,
        default: false
    }
})

const ingredients = new mongoose.Schema({
    ingredient: {
        type: objectId,
        required: true,
        ref: 'Ingredient'
    },
    calorie: {
        type: Number,
        required: true,
        min: 0,
        default: 0.0
    },
    calorieUnit: {
        type: String,
        default: "kcal"
    }
})

const menuSchema = new mongoose.Schema(
    {
        user: {
            type: objectId,
            required: true,
            ref: 'User'
        },
        shop: {
            type: objectId,
            required: true,
            ref: 'Shop'
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            default: getSymbolFromCurrency('GBP')
        },
        ingredients: [ingredients],
        category: {
            type: objectId,
            required: true,
            ref: 'Category'
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            emun: ['avaiable', 'sold-out']
        },
        image: assestSchema
    },
    {
        timestamps: true,
    }
)

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;