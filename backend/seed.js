const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./products/models/Product");

const parseExtendedJson = (obj) => {
	if (obj === null || typeof obj !== "object") return obj;

	if (obj.$oid) {
		return new mongoose.Types.ObjectId(obj.$oid);
	}
	if (obj.$date) {
		return new Date(obj.$date);
	}

	if (Array.isArray(obj)) {
		return obj.map(parseExtendedJson);
	}

	const parsed = {};
	for (const key of Object.keys(obj)) {
		parsed[key] = parseExtendedJson(obj[key]);
	}
	return parsed;
};

const seedProducts = async () => {
	try {
		const count = await Product.countDocuments();
		if (count > 0) {
			console.log("Products collection already seeded, skipping.");
			return;
		}

		const filePath = path.join(__dirname, "seed-data", "products.json");
		if (!fs.existsSync(filePath)) {
			console.warn("Seed data file not found:", filePath);
			return;
		}

		const raw = fs.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(raw);
		const products = Array.isArray(parsed) ? parsed : [parsed];
		const converted = products.map(parseExtendedJson);

		await Product.insertMany(converted);
		console.log(`Seeded ${converted.length} products.`);
	} catch (error) {
		console.error("Failed to seed products:", error.message);
	}
};

module.exports = seedProducts;
