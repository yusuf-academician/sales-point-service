const Joi = require("joi");


function validateCategory(body){
    const categorySchema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        category: Joi.string().required()
    })

    return categorySchema.validate(body)
}

module.exports = {
    validateCategory
}