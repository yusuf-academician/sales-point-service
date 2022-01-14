const router = require("express").Router();
const controller = require("../controllers");
const { Auth } = require('../middlewares/auth');
const { uploadS3 } = require('../utils/index')

router.patch("/find", controller.menu.find);

router.get("/", controller.menu.getMenus);

router.get("/user", Auth, controller.menu.getMenusByUser);

router.get("/category/:categoryId", controller.menu.getMenusByCategory);

router.get("/:menuId", controller.menu.getMenu);

router.post("/", Auth, controller.menu.createMenu);

router.patch("/upload-file/:menuId", Auth, uploadS3.single('image'),controller.menu.uploadFile);

router.patch("/:menuId", Auth, controller.menu.updateMenu);

router.delete("/:menuId", Auth, controller.menu.deleteMenu);

router.get("/search/:name", controller.menu.searchMenu);


module.exports = router