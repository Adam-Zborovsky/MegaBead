const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["necklace", "bracelet"],
			required: true,
		},
		image: {
			type: String,
			default: "",
		},
		description: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

productSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model("Product", productSchema);
