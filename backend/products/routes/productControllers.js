const express = require("express");
const auth = require("../../auth/authService");
const upload = require("../helpers/uploadProductService");
const {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../models/productAccessDataService");
const { handleError } = require("../../utils/handleErrors");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
	try {
		const products = await getAllProducts();
		res.status(200).json(products);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
	try {
		const product = await getProductById(req.params.id);
		if (!product) return handleError(res, 404, "Product not found");
		res.status(200).json(product);
	} catch (err) {
		handleError(res, err.status || 400, err.message);
	}
});

// POST /api/products       ← Admin only, optional image upload
router.post(
	"/",
	auth,
	(req, res, next) => {
		if (!req.user.isAdmin) return handleError(res, 403, "Admins only");
		next();
	},
	upload.single("image"),
	async (req, res) => {
		try {
			const data = {
				name: req.body.name,
				price: req.body.price,
				type: req.body.type,
				description: req.body.description,
				image: req.file ? req.file.filename : "",
			};
			const product = await createProduct(data);
			res.status(201).json(product);
		} catch (err) {
			handleError(res, err.status || 400, err.message);
		}
	}
);

// PUT /api/products/:id    ← Admin only, can overwrite image
router.put(
	"/:id",
	auth,
	(req, res, next) => {
		if (!req.user.isAdmin) return handleError(res, 403, "Admins only");
		next();
	},
	upload.single("image"),
	async (req, res) => {
		try {
			const data = {
				name: req.body.name,
				price: req.body.price,
				type: req.body.type,
				description: req.body.description,
			};
			if (req.file) data.image = req.file.filename;

			const updated = await updateProduct(req.params.id, data);
			res.status(200).json(updated);
		} catch (err) {
			handleError(res, err.status || 400, err.message);
		}
	}
);

// DELETE /api/products/:id ← Admin only
router.delete(
	"/:id",
	auth,
	(req, res, next) => {
		if (!req.user.isAdmin) return handleError(res, 403, "Admins only");
		next();
	},
	async (req, res) => {
		try {
			const deleted = await deleteProduct(req.params.id);
			res.status(200).json(deleted);
		} catch (err) {
			handleError(res, err.status || 400, err.message);
		}
	}
);

module.exports = router;
