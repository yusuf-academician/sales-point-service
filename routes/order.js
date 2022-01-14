const router = require("express").Router();
const controller = require("../controllers");
const { Auth } = require('../middlewares/auth')

router.patch('/cancel/:orderId', Auth,controller.order.approveOrderOrCancelOrder);

router.get('/user', Auth,controller.order.getOrdersByUser);

router.get('/find', Auth,controller.order.getOrdersByUserfind);

router.post("/",Auth, controller.order.createOrder)

router.get("/", Auth, controller.order.getOrders)

router.get("/:orderId", Auth,controller.order.getOrder)

router.get("/shop/:shopId", Auth, controller.order.getOrdersByShop)

router.patch('/approve/:orderId', Auth,controller.order.approveOrderOrCancelOrder);

module.exports = router