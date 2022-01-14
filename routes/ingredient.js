const router = require("express").Router();
const controller = require("../controllers");
const { Auth, hasRole, ROLES } = require('../middlewares/auth');

router.get("/", Auth,controller.ingredient.getIngredients);

router.get("/admin",[Auth, hasRole(ROLES.ADMIN)],controller.ingredient.getIngredientsByAdmin);

router.get("/", Auth ,controller.ingredient.getIngredients);

router.get("/:ingredientId",Auth,controller.ingredient.getIngredient);

router.post("/",[Auth, hasRole(ROLES.ADMIN)],controller.ingredient.createIngredient);

router.patch("/:ingredientId",[Auth, hasRole(ROLES.ADMIN)],controller.ingredient.updateIngredient);

router.delete("/:ingredientId",[Auth, hasRole(ROLES.ADMIN)],controller.ingredient.deleteIngredient);

module.exports = router