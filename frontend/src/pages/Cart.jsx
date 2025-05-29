import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/userServices";
import { toast } from "react-toastify";
import AddShippingWindow from "../components/AddShippingWindow";
import AddPaymentWindow from "../components/AddPaymentWindow";

const Cart = () => {
	const { cart, removeItemFromCart } = useContext(CartContext);
	const { user, token } = useContext(AuthContext);
	const [shippingOption, setShippingOption] = useState("");
	const [paymentOption, setPaymentOption] = useState("");
	const [showShippingWindow, setShowShippingWindow] = useState(false);
	const [showPaymentWindow, setShowPaymentWindow] = useState(false);

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
			// Filter out temporary custom items
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
										{item.productId?.image ? (
											<img
												src={`${process.env.REACT_APP_API_URL}images/${item.productId.image}`}
												alt={item.productId.name}
												className="img-fluid mb-3"
											/>
										) : item.customProduct ? (
											<div>
												<p className="mb-0">{item.customProduct.name}</p>
												<p className="mb-0">
													Price: {item.customProduct.price}
												</p>
												<p className="mb-0">
													Description: {item.customProduct.description}
												</p>
											</div>
										) : (
											<img
												src={`/images/default_${
													item.productId?.type || "custom"
												}.png`}
												alt={item.productId?.name || "Custom Product"}
												className="img-fluid mb-3"
											/>
										)}
										<div>
											<p className="mb-0">Quantity: {item.quantity}</p>
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
									<option key={index} value={address}>
										{address}
									</option>
								))}
							</select>
							<button
								className="btn btn-secondary mt-2"
								onClick={() => setShowShippingWindow(true)}
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
									<option key={index} value={card}>
										{card}
									</option>
								))}
							</select>
							<button
								className="btn btn-secondary mt-2"
								onClick={() => setShowPaymentWindow(true)}
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
			{showShippingWindow && (
				<AddShippingWindow
					onClose={() => setShowShippingWindow(false)}
					onSubmit={handleAddShippingAddress}
				/>
			)}
			{showPaymentWindow && (
				<AddPaymentWindow
					onClose={() => setShowPaymentWindow(false)}
					onSubmit={handleAddPaymentMethod}
				/>
			)}
		</div>
	);
};

export default Cart;
