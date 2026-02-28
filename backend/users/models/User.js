const mongoose = require("mongoose");

const paymentOptionSchema = new mongoose.Schema(
	{
		cardHolderName: { type: String, required: true },
		cardNumber: {
			type: String,
			required: true,
			validate: {
				validator: (v) => /^\d{13,19}$/.test(v.replace(/\s+/g, "")),
				message: (props) => `${props.value} is not a valid credit-card number!`,
			},
		},
		expiryMonth: {
			type: Number,
			required: true,
			min: 1,
			max: 12,
		},
		expiryYear: {
			type: Number,
			required: true,
			validate: {
				validator: function (v) {
					const now = new Date();
					const thisYear = now.getFullYear();
					const thisMonth = now.getMonth() + 1;
					return (
						v > thisYear || (v === thisYear && this.expiryMonth >= thisMonth)
					);
				},
				message: (props) => `Card expired: ${props.value}/${this.expiryMonth}`,
			},
		},
		cvv: {
			type: String,
			required: true,
			select: false,
			validate: {
				validator: (v) => /^\d{3,4}$/.test(v),
				message: (props) => `${props.value} is not a valid CVV`,
			},
		},
	},
	{ _id: false }
);

const shippingOptionSchema = new mongoose.Schema(
	{
		addressLine1: { type: String, required: true },
		addressLine2: { type: String, required: false },
		city: { type: String, required: true },
		state: { type: String, required: false },
		postalCode: { type: String, required: true },
		country: { type: String, required: true },
	},
	{ _id: false }
);

const cartItemSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
		customProduct: {
			type: Object,
			default: null,
		},
		quantity: { type: Number, default: 1 },
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema(
	{
		name: {
			first: { type: String, required: true },
			middle: { type: String, required: false },
			last: { type: String, required: true },
		},
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
		paymentOptions: {
			type: [paymentOptionSchema],
			required: false,
			default: [],
		},
		shippingOptions: {
			type: [shippingOptionSchema],
			required: false,
			default: [],
		},
		cart: {
			type: [cartItemSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
