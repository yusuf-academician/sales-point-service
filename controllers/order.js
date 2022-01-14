const { MSG_TYPES } = require("../constant/types");
const { JsonResponse } = require("../lib/apiResponse");
const { paginate } = require("../utils/index");
const { validateOrder } = require('../request/order')
const OrderService = require("../services/order")
const moment = require('moment');


exports.createOrder = async (req, res, next) => {
    try {
        req.body.user = req.user._id

        const { error } = validateOrder(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let createOrder = await OrderService.create(req.body)

        JsonResponse(res, 201, MSG_TYPES.CREATED, createOrder)
    } catch (error) {
        console.log({ error })
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const { page, pageSize, skip } = paginate(req);

        const { orders, total } = await OrderService.getAllOrders();

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        };

        JsonResponse(res, 200, MSG_TYPES.FETCHED, orders, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.getOrder = async (req, res, next) => {
    try {
        let filter = {
            _id: req.params.orderId
        }

        const order = await OrderService.getOrder(filter)

        JsonResponse(res, 200, MSG_TYPES.FETCHED, order)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}


exports.getOrdersByShop = async (req, res, next) => {
    try {
        let filter = {
            shop: req.params.shopId
        }
        const { page, pageSize, skip } = paginate(req);

        const { orders, total } = await OrderService.getAllOrders(filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, orders, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}



exports.getOrdersByUser = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id
        }
        const { page, pageSize, skip } = paginate(req);

        const { orders, total } = await OrderService.getAllOrders(filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, orders, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.getOrdersByUserfind = async (req, res, next) => {
    try {
        let filter = {
            user: req.user._id,
            createdAt: {
                $gt: new Date(new Date().setUTCHours(0, 0, 0, 0))
            }
        }
        const { page, pageSize, skip } = paginate(req);

        const { orders, total } = await OrderService.getAllOrders(filter)

        const meta = {
            total,
            pagination: {
                pageSize, page
            }
        }

        JsonResponse(res, 200, MSG_TYPES.FETCHED, orders, meta)
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}

exports.approveOrderOrCancelOrder = async (req, res, next) => {
    try {

        let filter = {
            _id: req.params.orderId
        }

        const order = await OrderService.updateOrder(filter, req.body)

        return JsonResponse(res, 200, MSG_TYPES.UPDATED, order);
    } catch (error) {
        JsonResponse(res, error.statusCode, error.msg)
        next(error)
    }
}
