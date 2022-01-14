const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateCart } = require("../request/cart");
const CartService = require("../services/cart");


exports.createCart = async (req, res, next) => { 
    try {
        req.body.user = req.user._id;

        const { error } = validateCart(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        
        let createCart= await CartService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createCart)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.getCart = async (req, res, next) => { 
    try {
        let filter = {
            _id: req.params.cartId
        }
        const cart = await CartService.getCart(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, cart)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.getCartsByUser = async (req, res, next) => { 
    try {
        let filter = {
            user: req.user._id
        }

        const {carts, total, calories, caloriesUnit} = await CartService.getCarts(filter)

        let metadata = {
            total,
            calories,
            caloriesUnit
        }
        JsonResponse(res, 200, MSG_TYPES.FETCHED, carts, metadata)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.updateCart = async (req, res, next) => { 
    try {
        const cartId = req.params.cartId;

        await CartService.updateCart(cartId, req.body, req.user);

        return JsonResponse(res, 200, MSG_TYPES.UPDATED);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.deleteCart = async (req, res, next) => { 
    try {
        const cartId = req.params.cartId;

        await CartService.removeCart(cartId, req.user)

        return JsonResponse(res, 200, MSG_TYPES.DELETED)  
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}