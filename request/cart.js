const Joi = require("joi");


function validateCart(body){
    const cartSchema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        menu: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        quantity: Joi.number().required(),
        amount: Joi.number().required(),

    });

    return cartSchema.validate(body)
}

module.exports = { 
    validateCart
}