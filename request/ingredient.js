const Joi = require("joi");


function validateIngredient(body){
    const ingredientSchema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        ingredient: Joi.string().required(),
    })

    return ingredientSchema.validate(body)
}

module.exports = {
    validateIngredient
}