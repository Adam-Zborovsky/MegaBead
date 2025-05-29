const express = require("express");
const auth = require("../../auth/authService");
const User = require("../models/User");
const { handleError } = require("../../utils/handleErrors");

const router = express.Router();

// Add to Cart
router.post("/", auth, async (req, res) => {
	try {
		const userId = req.user._id;
		const { productId, quantity, customProduct } = req.body;

		const user = await User.findById(userId);
		if (!user) return handleError(res, 404, "User not found");

		if (productId) {
			const existingItem = user.cart.find(
				(item) => item.productId.toString() === productId
			);

			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				user.cart.push({ productId, quantity });
			}
		} else if (customProduct) {
			user.cart.push({ customProduct, quantity });
		}

		await user.save();
		res.status(200).json({ message: "Item added to cart", cart: user.cart });
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// Get Cart
router.get("/:userId", auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).populate(
			"cart.productId"
		);
		if (!user) return handleError(res, 404, "User not found");

		res.status(200).json({ cart: user.cart });
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// Remove from Cart
router.delete("/", auth, async (req, res) => {
	try {
		const { userId, productId } = req.body;

		const user = await User.findById(userId);
		if (!user) return handleError(res, 404, "User not found");

		user.cart = user.cart.filter(
			(item) => item.productId.toString() !== productId
		);

		await user.save();
		res
			.status(200)
			.json({ message: "Item removed from cart", cart: user.cart });
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
