const express = require("express");
const router = express.Router();
const userRouterController = require("../users/routes/userControllers.js");
const productRouterController = require("../products/routes/productControllers");
const cartControllers = require("../users/routes/cartControllers");
const { handleError } = require("../utils/handleErrors");

router.use("/users", userRouterController);
router.use("/products", productRouterController);
router.use("/cart", cartControllers);

router.use((req, res) => {
	handleError(res, 404, "Path not found");
});

module.exports = router;
