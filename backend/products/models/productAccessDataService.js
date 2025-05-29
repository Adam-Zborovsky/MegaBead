const Product = require("./Product");
const fs = require("fs");
const path = require("path");

async function getAllProducts() {
	return Product.find({}).lean({ virtuals: true });
}

async function getProductById(id) {
	return Product.findById(id).lean({ virtuals: true });
}

async function createProduct(data) {
	const p = new Product(data);
	return p.save();
}

async function updateProduct(id, data) {
	return Product.findByIdAndUpdate(id, data, { new: true }).lean({
		virtuals: true,
	});
}

async function deleteProduct(id) {
	const product = await Product.findByIdAndDelete(id).lean({ virtuals: true });
	if (product && product.image) {
		const imagePath = path.join(__dirname, "../product-images", product.image);
		fs.unlink(imagePath, (err) => {
			if (err) console.error(`Failed to delete image: ${imagePath}`, err);
		});
	}
	return product;
}

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
