const router = require("express").Router();
const controller = require("../controllers");
const { Auth } = require('../middlewares/auth');

router.get("/", Auth, controller.cart.getCartsByUser);

router.patch("/:cartId", Auth, controller.cart.updateCart);

router.get("/:cartId", Auth, controller.cart.getCart);

router.post("/", Auth, controller.cart.createCart);

router.delete("/:cartId", Auth, controller.cart.deleteCart);


module.exports = router