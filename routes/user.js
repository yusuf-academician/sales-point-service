const router = require("express").Router();
const controller = require("../controllers");
const { Auth } = require('../middlewares/auth')

router.get("/",Auth,controller.user.getAllUser)

router.get("/me",Auth,controller.user.getMe)

router.get("/:id",Auth,controller.user.getUser)

router.post("/",controller.user.createUser)

router.get('/confirmation/:email/:token',controller.user.confirmEmail)

router.patch("/",Auth,controller.user.updateUser)

router.patch("/me",Auth,controller.user.teminateMe)

module.exports = router