const mongoose = require("mongoose");
require("dotenv").config();

const connectToAtlasDb = async () => {
	try {
		const uri = process.env.MONGO_URI;
		await mongoose.connect(uri);
		console.log("Connected to MongoDB Atlas");
	} catch (error) {
		console.error("Could not connect to MongoDB Atlas:", error);
		throw error;
	}
};

module.exports = connectToAtlasDb;
