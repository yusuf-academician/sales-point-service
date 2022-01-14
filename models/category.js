const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const categorySchema = new mongoose.Schema(
    {
        user:{
            type: objectId,
            required: true,
            ref: 'User'
        },
        category:{
            type: String,
            required: true,
            index: true
        }
    },
    {
        timestamps: true,
    }
)

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;