import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import { toast } from "react-toastify";
import AddShippingModal from "../components/AddShippingModal";
import AddPaymentWindow from "../components/AddPaymentModal";
import { Link } from "react-router-dom";

const Cart = () => {
	const { cart, removeItemFromCart } = useContext(CartContext);
	const { user, token } = useContext(AuthContext);
	const [shippingOption, setShippingOption] = useState("");
	const [paymentOption, setPaymentOption] = useState("");
	const [showShippingModal, setShowShippingModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const handleShippingChange = (event) => {
		setShippingOption(event.target.value);
	};

	const handlePaymentChange = (event) => {
		setPaymentOption(event.target.value);
	};

	const handleAddShippingAddress = (shippingAddress) => {
		updateUser({ shippingOptions: [...user.shippingOptions, shippingAddress] })
			.then((res) => {
				if (res.status === 200) {
					toast.success("Shipping address added successfully!");
				}
			})
			.catch((err) => {
				console.error("Error updating shipping address:", err);
			});
	};

	const handleAddPaymentMethod = (paymentDetails) => {
		updateUser({ paymentOptions: [...user.paymentOptions, paymentDetails] })
			.then((res) => {
				if (res.status === 200) {
					toast.success("Payment method added successfully!");
				}
			})
			.catch((err) => {
				console.error("Error updating payment method:", err);
			});
	};

	const handleCheckout = async () => {
		try {
			const updatedCart = cart.filter(
				(item) => !item.customProduct?.isTemporary
			);
			await updateUser(user._id, { cart: updatedCart }, token);
			toast.success("Checkout successful!");
		} catch (error) {
			console.error("Error during checkout:", error);
			toast.error("Checkout failed. Please try again.");
		}
	};

	const handleRemoveItem = async (itemId) => {
		try {
			if (itemId === "Custom necklace" || itemId === "Custom bracelet") {
				const updatedCart = cart.filter(
					(item) => item.customProduct?.name !== itemId
				);
				await updateUser(user._id, { cart: updatedCart }, token);
			} else {
				removeItemFromCart(itemId);
			}
			window.location.reload();
		} catch (error) {
			console.error("Error removing item:", error);
			toast.error("Failed to remove item. Please try again.");
		}
	};

	if (cart.length === 0) {
		return (
			<div className="text-center">
				<h1>Your Cart is Empty</h1>
				<p>
					Start designing your custom jewelry or browse our ready-made
					collection.
				</p>
				<div className="d-flex justify-content-center gap-3">
					<Link to="/builder" className="btn btn-primary btn-lg rounded-pill">
						Go to Builder
					</Link>
					<Link
						to="/products"
						className="btn btn-secondary btn-lg rounded-pill"
					>
						Shop Ready-Made
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div className="container mt-5">
			<div className="row shadow-lg p-3 mb-5 bg-white rounded">
				<div className="col-md-8">
					<div className="cart-items">
						<h1>Your Cart</h1>
						<ul className="list-group">
							{cart.map((item) => (
								<li
									key={item.productId?._id || item.customProduct?.name}
									className="list-group-item d-flex justify-content-between align-items-center"
								>
									<div className="d-flex align-items-center">
										{item.productId ? (
											<img
												src={`${process.env.REACT_APP_API_URL}images/${item.productId.image}`}
												alt={item.productId.name}
												className="img-fluid me-4"
												style={{ maxWidth: "150px", maxHeight: "150px" }}
											/>
										) : (
											<img
												src={`/images/default_${item.customProduct.type}.png`}
												alt={item.customProduct.name}
												className="img-fluid me-4"
												style={{ maxWidth: "150px", maxHeight: "150px" }}
											/>
										)}
										<div>
											<p className="mb-0">
												{item.productId
													? item.productId.name
													: item.customProduct.name}
											</p>
											<p className="mb-0">
												Price:{" "}
												{item.productId
													? item.productId.price
													: item.customProduct.price}
											</p>
											<p className="mb-0">
												Description:{" "}
												{item.productId
													? item.productId.description
													: item.customProduct.description}
											</p>
										</div>
									</div>
									<button
										className="btn btn-danger btn-sm"
										onClick={() =>
											handleRemoveItem(
												item.productId?._id || item.customProduct?.name
											)
										}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="col-md-4">
					<div className="cart-options">
						<div className="shipping mb-3 text-center">
							<h2>Shipping Options</h2>
							<select
								className="form-select mb-2"
								value={shippingOption}
								onChange={handleShippingChange}
							>
								<option value="">Select Shipping</option>
								<option value="Standard">Standard</option>
								<option value="Express">Express</option>
							</select>
							<select
								className="form-select mb-2"
								value={shippingOption}
								onChange={(e) => setShippingOption(e.target.value)}
							>
								<option value="">Select Address</option>
								{user?.shippingOptions.map((address, index) => (
									<option key={index} value={address.addressLine1}>
										{`${address.addressLine1}, ${address.city}, ${address.state}`}
									</option>
								))}
							</select>
							<button
								className="btn btn-secondary mt-2"
								onClick={() => setShowShippingModal(true)}
							>
								Add Shipping Address
							</button>
						</div>
						<div className="payment mb-3 text-center">
							<h2>Payment Options</h2>
							<select
								className="form-select mb-2"
								value={paymentOption}
								onChange={handlePaymentChange}
							>
								<option value="">Select Payment</option>
								<option value="Credit Card">Credit Card</option>
								<option value="PayPal">PayPal</option>
							</select>
							<select
								className="form-select mb-2"
								value={paymentOption}
								onChange={(e) => setPaymentOption(e.target.value)}
							>
								<option value="">Select Card</option>
								{user?.paymentOptions.map((card, index) => (
									<option key={index} value={card.cardNumber}>
										{`${card.cardNumber} - ${card.cardType}`}
									</option>
								))}
							</select>
							<button
								className="btn btn-secondary mt-2"
								onClick={() => setShowPaymentModal(true)}
							>
								Add Payment Method
							</button>
						</div>
						<button className="btn btn-primary w-100" onClick={handleCheckout}>
							Checkout
						</button>
					</div>
				</div>
			</div>
			{showShippingModal && (
				<AddShippingModal
					onClose={() => setShowShippingModal(false)}
					onSubmit={handleAddShippingAddress}
				/>
			)}
			{showPaymentModal && (
				<AddPaymentWindow
					onClose={() => setShowPaymentModal(false)}
					onSubmit={handleAddPaymentMethod}
				/>
			)}
		</div>
	);
};

export default Cart;
