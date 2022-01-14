const Order = require("../models/order")
const MenuService = require('../services/menu');
const { MSG_TYPES } = require('../constant/types');
const { GenerateOTP, mailSender } = require('../utils/index.js');
const SendReceipt = require('../templates/reciptTemplate');
const User = require('../models/user');
const Menu = require('../models/menu');
class OrderService {

    /**
     * Create Order 
     * @param {Object} body request body object
    */
    static create(body) {
        return new Promise(async (resolve, reject) => {
            try {
                let filter = {
                    _id: body.menu
                }
                const menu = await MenuService.getMenu(filter);
                let calorie = 0
                
                if(menu.ingredients.length > 1){    
                    for(let i=0; i < menu.ingredients.length; i++){
                        let caloriesTotal = menu.ingredients[i].calorie * body.quantity;
                        calorie += caloriesTotal;
                    }
                    body.calorie = calorie;
                }else{
                    let caloriesTotal = menu.ingredients[0].calorie * body.quantity;
                    body.calorie = caloriesTotal;
                }
                body.calorieUnit = menu.ingredients[0].calorieUnit;
                body.orderId = 'SP-'+ GenerateOTP(10);
                const newOrder = new Order(body);

                const user = await User.findById(newOrder.user)
                console.log(menu)
                let to = {
                    "Email": user.email,
                    "Name": user.name
                };
                let subject = "Receipt";
                let textpart = "Order Receipt"
                const html = SendReceipt(newOrder, menu, user)
                await mailSender(to, subject,textpart, html)

                await newOrder.save();

                resolve(newOrder)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Get Orders 
     * @param {Number} skip skip
     * @param {Number} pageSize page size
     * @param {Object} filter filter
    */
    static getAllOrders(filter = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await Order.find(filter).populate('user shop menu').sort({createdAt: -1})

                const total = await Order.find(filter).countDocuments()

                resolve({ orders, total })
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Get Order 
     * @param {Object} filter filter
    */
    static getOrder(filter) {
        return new Promise(async (resolve, reject) => {
            try {
                const order = await Order.findOne(filter);

                if (!order) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                resolve(order)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static updateOrder(filter={}, orderObject){
        return new Promise(async (resolve, reject) => {
            try {
                const order = await Order.findOne(filter)

                if (!order) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await order.updateOne(
                    {
                        $set: orderObject
                    }
                )

                resolve(order)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }
}

module.exports = OrderService