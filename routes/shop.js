const router = require("express").Router();
const controller = require("../controllers");
const { Auth, hasRole, ROLES } = require('../middlewares/auth');
const { uploadS3 } = require('../utils/index')

router.get("/", controller.shop.getShops);

router.get("/user", Auth, controller.shop.getShopByUser);

router.get("/:shopId", Auth, controller.shop.getShop);

router.post("/", Auth, controller.shop.createShop);

router.patch("/file-upload/:shopId", Auth, uploadS3.fields([
    { name: 'document', maxcount: 2 },
    { name: 'image', maxcount: 2 },
    { name: 'logo', maxcount: 1 }
]), controller.shop.uploadImage);

router.patch("/:shopId", Auth, controller.shop.updateShop);

router.patch("/approve/:shopId", Auth, controller.shop.approveShop);

router.delete("/:shopId", Auth, controller.shop.deleteShop);

module.exports = router