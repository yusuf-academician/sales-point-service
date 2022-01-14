const Ingredient = require('../models/ingredient');
const Category = require('../models/category');
const { MSG_TYPES } = require('../constant/types');


class IngredientService {

    static create(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const ingredient = await Ingredient.findOne({
                    user: body.user,
                    ingredient: body.ingredient
                })
                if(ingredient){
                    reject({ statusCode: 404, msg: MSG_TYPES.EXIST });
                    return;
                }

                const newIngredient = new Ingredient(body)
                await newIngredient.save()

                resolve(newIngredient)
            } catch (error) {
                console.log({error})
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getIngredient(filter){
        return new Promise(async (resolve, reject) => {
            try {
                const ingredient  = await Ingredient.findOne(filter);

                if (!ingredient) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                resolve(ingredient) 
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getIngredients(skip, pageSize, filter = {}){
        return new Promise(async (resolve, reject) => {
            try {
                const ingredients = await Ingredient.find(filter)

                const total = await Ingredient.find(filter).countDocuments()

                resolve({ ingredients, total })
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static updateIngredient(user,ingredientId, ingredientObject){
        return new Promise(async (resolve, reject) => {
            try {
                const ingredient = await Ingredient.findOne({
                    user: user._id,
                    _id: ingredientId
                })
                if (!ingredient) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await ingredient.updateOne(
                    {
                        $set: ingredientObject
                    }
                )

                resolve(ingredient)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static deleteIngredient(user, ingredientId){
        return new Promise(async (resolve, reject) => {
            try {
                const ingredient = await Ingredient.findOne({
                    user: user._id,
                    _id: ingredientId
                })
                if (!ingredient) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await ingredient.delete();

                resolve({ msg: MSG_TYPES.DELETED })
            } catch (error) {

            }
        })
    }
}

module.exports = IngredientService