const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateShop } = require("../request/shop");
const ShopService = require("../services/shop");

/** 
 * Create Shop
 * @param {*} req
 * @param {*} res
*/
exports.createShop = async (req, res, next) => {
    try {
        req.body.user = req.user._id;

        const { error } = validateShop(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let createShop = await ShopService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createShop)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


exports.uploadImage = async (req, res, next) => {
    try {
        console.log(req.files)

        let assets = await ShopService.returnImages(req.files);
        let body = {
            certificates: assets
        }

       let shop =  await ShopService.updateShop(req.params.shopId, body,req.user)
    
        JsonResponse(res, 200, MSG_TYPES.UPDATED, shop)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Shops
 * @param {*} req
 * @param {*} res
*/
exports.getShops = async (req, res, next) => {
    try {
        const { page, pageSize, skip } = paginate(req);

        const { shops, total } = await ShopService.getAllShop(req.body)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, shops, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get Shop
 * @param {*} req
 * @param {*} res
*/
exports.getShop = async (req, res, next) => {
    try {
        let filter = {
            _id: req.params.shopId
        }

        const shop = await ShopService.getShop(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, shop)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * get User's shop
 * @param {*} req
 * @param {*} res
*/
exports.getShopByUser = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id
        }
        const { page, pageSize, skip } = paginate(req);

        const { shops, total } = await ShopService.getAllShop(filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, shops, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}



/** 
 * update Shop
 * @param {*} req
 * @param {*} res
*/
exports.updateShop = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;

        await ShopService.updateShop(shopId, req.body, req.user);

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


exports.approveShop = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;

        await ShopService.updateShop(shopId, req.body, req.user)

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

/** 
 * delete Shop
 * @param {*} req
 * @param {*} res
*/
exports.deleteShop = async (req, res, next) => {
    try {
        const shopId = req.params.shopId;

        const shop = await ShopService.deleteShop(req.user, shopId);

        return JsonResponse(res, 200, MSG_TYPES.DELETED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}