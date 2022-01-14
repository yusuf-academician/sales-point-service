const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const assestSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    name:{
        type: String, 
        required: true
    },
    fieldName:{ 
        type: String, 
        required: true
    },
    default: {
        type: Boolean,
        default: false
    }
})


const shopSchema = new mongoose.Schema(
    {
        user:{
            type: objectId,
            required: true,
            ref: 'User'
        },
        name:{
            type: String,
            required: true,
            index: true
        },
        description:{
            type: String,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        postCode:{
            type: String,
            required: true,
        },
        certificates: [assestSchema],
        approvalStatus:{
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;