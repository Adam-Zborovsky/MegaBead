const express = require("express");
const auth = require("../../auth/authService");
const {
	registerUser,
	getUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getToken,
} = require("../models/userAccessDataService");
const {
	validateRegistration,
	validateLogin,
} = require("../validation/userValidationService");
const { handleError } = require("../../utils/handleErrors");

function parsePaymentOptions(raw) {
	try {
		const arr = JSON.parse(raw);
		if (!Array.isArray(arr)) throw new Error();
		return arr.map((opt) => ({
			cardHolderName: opt.cardHolderName,
			cardNumber: opt.cardNumber,
			expiryMonth: opt.expiryMonth,
			expiryYear: opt.expiryYear,
			cvv: opt.cvv,
		}));
	} catch {
		throw new Error("Invalid paymentOptions format");
	}
}

const router = express.Router();

// REGISTER
router.post("/", async (req, res) => {
	try {
		const userData = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
		};

		if (req.body.paymentOptions) {
			userData.paymentOptions = parsePaymentOptions(req.body.paymentOptions);
		}

		const { error } = validateRegistration(userData);
		if (error) return handleError(res, 400, error.message);

		const user = await registerUser(userData);
		res.status(201).json(user);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const msg = validateLogin(req.body);
		if (msg) return handleError(res, 400, msg);

		const token = await loginUser(req.body.email, req.body.password);
		res.status(200).json({ token });
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// GET ALL USERS
router.get("/", auth, async (req, res) => {
	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// GET TOKEN (self or admin)
router.get("/token/:id", auth, async (req, res) => {
	try {
		const { _id, isAdmin } = req.user;
		if (_id !== req.params.id && !isAdmin)
			return handleError(res, 403, "Forbidden");

		const token = await getToken(_id);
		res.status(200).json({ token });
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// GET ONE USER (self or admin)
router.get("/:id", auth, async (req, res) => {
	try {
		const { _id, isAdmin } = req.user;
		if (_id !== req.params.id && !isAdmin)
			return handleError(res, 403, "Forbidden");

		const user = await getUser(req.params.id);
		if (!user) return handleError(res, 404, "User not found");
		res.status(200).json(user);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// UPDATE USER (self or admin)
router.put("/:id", auth, async (req, res) => {
	try {
		const { _id, isAdmin } = req.user;
		if (_id !== req.params.id && !isAdmin)
			return handleError(res, 403, "Forbidden");

		const updateData = {};
		if (req.body.name) updateData.name = req.body.name;
		if (req.body.email) updateData.email = req.body.email;
		if (req.body.password) updateData.password = req.body.password;
		if (req.body.isAdmin !== undefined) updateData.isAdmin = req.body.isAdmin;
		if (req.body.paymentOptions)
			updateData.paymentOptions = parsePaymentOptions(req.body.paymentOptions);
		if (req.body.shippingOptions)
			updateData.shippingOptions = req.body.shippingOptions;
		if (req.body.cart) updateData.cart = req.body.cart;

		const updatedUser = await updateUser(req.params.id, updateData);
		res.status(200).json(updatedUser);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// Update user profile
router.put("/:id", auth, async (req, res) => {
	try {
		const updatedUser = await updateUser(req.params.id, req.body);
		res.status(200).send(updatedUser);
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

// DELETE USER (self or admin)
router.delete("/:id", auth, async (req, res) => {
	try {
		const { _id, isAdmin } = req.user;
		if (_id !== req.params.id && !isAdmin)
			return handleError(res, 403, "Forbidden");

		await deleteUser(req.params.id);
		res.sendStatus(204);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// Delete user profile
router.delete("/me", auth, async (req, res) => {
	try {
		await deleteUser(req.user._id);
		res.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
		handleError(res, 500, error.message);
	}
});

module.exports = router;
