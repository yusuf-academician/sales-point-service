const router = require("express").Router();
const controller = require("../controllers");
const { Auth, hasRole, ROLES } = require('../middlewares/auth');

router.get("/", controller.category.getCategories);

router.get("/admin", [Auth, hasRole(ROLES.ADMIN)], controller.category.getCategoriesByAdmin);

router.get("/:categoryId", Auth, controller.category.getCategory);

router.post("/", [Auth, hasRole(ROLES.ADMIN)], controller.category.createCategory);

router.patch("/:categoryId", [Auth, hasRole(ROLES.ADMIN)], controller.category.updateCategory);

router.delete("/:categoryId", [Auth, hasRole(ROLES.ADMIN)], controller.category.deleteCategory);

module.exports = router