const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateCategory } = require("../request/category");
const CategoryService = require("../services/category");

/** 
 * Create Category
 * @param {*} req
 * @param {*} res
*/
exports.createCategory = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const { error } = validateCategory(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let createCategory = await CategoryService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createCategory)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Categories by admin
 * @param {*} req
 * @param {*} res
*/
exports.getCategoriesByAdmin = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id
        }
        const { page, pageSize, skip } = paginate(req);

        const { categories, total } = await CategoryService.getCategories(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, categories, meta)
    } catch (error) {
        console.log({error})
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Categories
 * @param {*} req
 * @param {*} res
*/
exports.getCategories = async (req, res, next) => {
    try {
        const { page, pageSize, skip } = paginate(req);

        const { categories, total } = await CategoryService.getCategories(skip, pageSize, req.body)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, categories, meta)
    } catch (error) {
        console.log({error})
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Category
 * @param {*} req
 * @param {*} res
*/
exports.getCategory = async (req, res, next) => {
    try {
        let filter = {
            _id: req.params.categoryId
        }

        const category = await CategoryService.getCategory(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, category)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


/** 
 * update Category
 * @param {*} req
 * @param {*} res
*/
exports.updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        await CategoryService.updateCategory(categoryId, req.body);

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * delete Category
 * @param {*} req
 * @param {*} res
*/
exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        await CategoryService.deleteCategory(req.user, categoryId)

        return JsonResponse(res, 200, MSG_TYPES.DELETED)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}