const mongoose = require("mongoose");

const connectToLocalDb = async () => {
	try {
		const uri = process.env.MONGO_URI || "mongodb://megabead-mongo:27017/MegaBead-Server";
		await mongoose.connect(uri);
		console.log("Connected to MongoDB locally");
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
	}
};

module.exports = connectToLocalDb;
