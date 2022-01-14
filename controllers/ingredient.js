const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateIngredient } = require("../request/ingredient");
const IngredientService = require("../services/ingredient");

/** 
 * Create Ingredient
 * @param {*} req
 * @param {*} res
*/
exports.createIngredient = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const { error } = validateIngredient(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let createIngredient = await IngredientService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createIngredient)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Ingredients by Admin
 * @param {*} req
 * @param {*} res
*/
exports.getIngredientsByAdmin = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id
        }
        const { page, pageSize, skip } = paginate(req);

        const { ingredients, total } = await IngredientService.getIngredients(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, ingredients, meta)
    } catch (error) {
        console.log({error})
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Ingredients
 * @param {*} req
 * @param {*} res
*/
exports.getIngredients = async (req, res, next) => {
    try {
        const { page, pageSize, skip } = paginate(req);

        const { ingredients, total } = await IngredientService.getIngredients(skip, pageSize, req.body)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, ingredients, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Ingredient
 * @param {*} req
 * @param {*} res
*/
exports.getIngredient = async (req, res, next) => {
    try {
        let filter = {
            _id: req.params.ingredientId
        }

        const ingredient = await IngredientService.getIngredient(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, ingredient)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


/** 
 * update Ingredient
 * @param {*} req
 * @param {*} res
*/
exports.updateIngredient = async (req, res, next) => {
    try {
        const ingredientId = req.params.ingredientId;

        await IngredientService.updateIngredient(req.user, ingredientId, req.body);

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * delete Ingredient
 * @param {*} req
 * @param {*} res
*/
exports.deleteIngredient = async (req, res, next) => {
    try {
        const ingredientId = req.params.ingredientId;

        const ingredient = await IngredientService.deleteIngredient(req.user, ingredientId);

        return JsonResponse(res, 200, MSG_TYPES.DELETED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}