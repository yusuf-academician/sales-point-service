const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const ingredientSchema = new mongoose.Schema(
    {
        user:{
            type: objectId,
            required: true,
            ref: 'User'
        },
        ingredient:{
            type: String,
            required: true,
            index: true
        }
    },
    {
        timestamps: true,
    }
)

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;