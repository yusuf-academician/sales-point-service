const { MSG_TYPES } = require('../constant/types');
const Cart = require('../models/cart');
const Menu = require('../models/menu');

class CartService {

    static create(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await Cart.findOne({
                    user: body.user,
                    menu: body.menu
                })
                if (cart) {
                    await cart.updateOne(
                        {
                            $inc: {
                                quantity: 1
                            }
                        }
                    )

                    return resolve(cart)
                }

                const newOrder = new Cart(body)
                await newOrder.save()

                resolve(newOrder)
            } catch (error) {
                console.log({ error })
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getCart(filter) {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await Cart.findOne(filter).populate('menu')

                if (!cart) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                resolve(cart)
            } catch (error) {
                console.log({ error })
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getCarts(filter) {
        return new Promise(async (resolve, reject) => {
            try {
                const carts = await Cart.find(filter)
                    .populate(
                        {
                            path: 'menu',
                            populate: {
                                path: 'shop category',
                            }
                        }
                    )
                    .populate(
                        {
                            path:'menu',
                            populate: {
                                path: 'ingredients',
                                populate: { path: 'ingredient' }
                            }
                        }
                    )

                let total = 0;
                let calories = 0;
                let caloriesUnit = "";

                if (carts.length > 1) {
                    for (let i = 0; i < carts.length; i++) {
                        let cartTotal = carts[i].amount * carts[i].quantity;
                        total += cartTotal;
                        caloriesUnit = carts[0].menu.ingredients[0].calorieUnit

                        calories += this.calculateCalories(carts[i])
                    }

                } else if (carts.length === 1) {
                    total = carts[0].amount * carts[0].quantity
                    caloriesUnit = carts[0].menu.ingredients[0].calorieUnit

                    calories = this.calculateCalories(carts[0])
                }

                calories = parseFloat(calories).toFixed(2);

                resolve({ carts, total, calories, caloriesUnit })
            } catch (error) {
                console.log({ error })
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static calculateCalories(cart) {
        let calories = 0;
        if (cart.menu.ingredients.length > 0) {
            for (let i = 0; i < cart.menu.ingredients.length; i++) {
                let caloriesTotal = cart.menu.ingredients[i].calorie * cart.quantity;
                calories += caloriesTotal
            }
        } else if (cart.menu.ingredients.length === 1) {
            calories = cart.menu.ingredients[0].calories * cart.quantity;
        }

        return calories;
    }

    static removeCart(cartId, user) {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await Cart.findOne({
                    _id: cartId,
                    user: user._id
                })
                if (!cart) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await cart.delete()

                resolve({ msg: MSG_TYPES.DELETED })
            } catch (error) {
                console.log({ error })
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static updateCart(cartId, cartObject, user) {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await Cart.findOne({
                    user: user._id,
                    _id: cartId
                })
                if (!cart) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await cart.updateOne(
                    {
                        $set: cartObject
                    }
                )

                resolve(cart)
            } catch (error) {
                console.log({ error })
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }
}

module.exports = CartService