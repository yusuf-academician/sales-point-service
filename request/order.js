const Joi = require("joi");


function validateOrder(body){
    const orderSchema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        shop: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        menu: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        quantity: Joi.number().min(0).required(),
        total: Joi.number().min(0).required(),
        address: Joi.string().required(),
        paymentMethod: Joi.string().required(),
    })

    return orderSchema.validate(body)
}

module.exports = {
    validateOrder
}