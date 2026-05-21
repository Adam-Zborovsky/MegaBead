const mongoose = require("mongoose");

const connectToLocalDb = async () => {
	try {
		await mongoose.connect("mongodb://megabead-mongo:27017/MegaBead-Server");
		console.log("Connected to MongoDB locally");
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
	}
};

module.exports = connectToLocalDb;
