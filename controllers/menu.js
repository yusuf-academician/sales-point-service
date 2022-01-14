const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateMenu } = require("../request/menu");
const MenuService = require("../services/menu");

/** 
 * Create Menu
 * @param {*} req
 * @param {*} res
*/
exports.createMenu = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const { error } = validateMenu(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let createMenu = await MenuService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createMenu)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


/** 
 * get Menus
 * @param {*} req
 * @param {*} res
*/
exports.getMenus = async (req, res, next) => {
    try {
        const { page, pageSize, skip } = paginate(req);
        let filter = {
            approvalStatus: true
        }
        
        const { menus, total } = await MenuService.getAllMenu(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, menus, meta)
    } catch (error) {
        console.log({error})
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


exports.uploadFile = async (req, res, next) => {
    try {
        console.log(req.file)
        let asset = await MenuService.returnImage(req.file)
        let body={
            image: asset
        }

        let menu = await MenuService.updateMenu(req.params.menuId, body, req.user)

        JsonResponse(res, 200, MSG_TYPES.UPDATED, menu)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Menus by user
 * @param {*} req
 * @param {*} res
*/
exports.getMenusByUser = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id
        }

        const { page, pageSize, skip } = paginate(req);

        const { menus, total } = await MenuService.getAllMenu(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, menus, meta)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Menus by category
 * @param {*} req
 * @param {*} res
*/
exports.getMenusByCategory = async (req, res, next) => {
    try {
        let filter = {
            category: req.params.categoryId
        }

        const { page, pageSize, skip } = paginate(req);

        const { menus, total } = await MenuService.getAllMenu(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, menus, meta)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Menu
 * @param {*} req
 * @param {*} res
*/
exports.getMenu = async (req, res, next) => {
    try {
        let filter = {
            _id: req.params.menuId
        }

        const shop = await MenuService.getMenu(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, shop)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


/** 
 * update Menu
 * @param {*} req
 * @param {*} res
*/
exports.updateMenu = async (req, res, next) => {
    try {
        const menuId = req.params.menuId;

        await MenuService.updateMenu(menuId, req.body, req.user);

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * delete Menu
 * @param {*} req
 * @param {*} res
*/
exports.deleteMenu = async (req, res, next) => {
    try {
        const menuId = req.params.menuId;

        await MenuService.deleteMenu(req.user, menuId);

        return JsonResponse(res, 200, MSG_TYPES.DELETED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * search Menu
 * @param {*} req
 * @param {*} res
*/
exports.searchMenu = async (req, res, next) => {
    try {
        let filter = {
            name: {
                '$regex': req.params.name
            }
        }

        console.log(filter)

        const { page, pageSize, skip } = paginate(req);

        const { menus, total } = await MenuService.getAllMenu(skip, pageSize, filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        return JsonResponse(res, 200, MSG_TYPES.FETCHED, menus, meta);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.find = async (req, res, next) => {
    try {
        console.log(req.body.filter)
        const { page, pageSize, skip } = paginate(req);

        const { menus, total } = await MenuService.getAllMenu(skip, pageSize, req.body.filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        return JsonResponse(res, 200, MSG_TYPES.FETCHED, menus, meta);
    } catch (error) {
        console.log({error})
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}