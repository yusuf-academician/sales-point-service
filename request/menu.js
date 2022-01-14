const Joi = require("joi");


function validateMenu(body){
    const menuSchema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        shop: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        ingredients: Joi.array().required(),
        category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        price: Joi.number().min(0).required(),
    });

    return menuSchema.validate(body)
}

module.exports = {
    validateMenu
}