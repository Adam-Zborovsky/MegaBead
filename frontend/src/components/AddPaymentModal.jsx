import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import "../style/Modal.css";

const AddPaymentModal = ({ onClose, onSubmit }) => {
	const { user, token } = useContext(AuthContext);
	const [paymentDetails, setPaymentDetails] = useState({
		cardHolderName: "",
		cardNumber: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPaymentDetails((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		const updatedPaymentOptions = [...user.paymentOptions, paymentDetails];
		updateUser(user._id, { paymentOptions: updatedPaymentOptions }, token)
			.then(() => {
				onSubmit(paymentDetails);
				onClose();
			})
			.catch(() => {
				toast.error("Failed to update payment options.");
			});
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h5 className="modal-title">Add Payment Method</h5>
					<button
						type="button"
						className="btn-close"
						onClick={onClose}
					></button>
				</div>
				<div className="modal-body">
					<input
						type="text"
						name="cardHolderName"
						className="form-control mb-2"
						placeholder="Card Holder Name"
						value={paymentDetails.cardHolderName}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="cardNumber"
						className="form-control mb-2"
						placeholder="Card Number"
						value={paymentDetails.cardNumber}
						onChange={handleChange}
					/>
					<input
						type="number"
						name="expiryMonth"
						className="form-control mb-2"
						placeholder="Expiry Month"
						value={paymentDetails.expiryMonth}
						onChange={handleChange}
					/>
					<input
						type="number"
						name="expiryYear"
						className="form-control mb-2"
						placeholder="Expiry Year"
						value={paymentDetails.expiryYear}
						onChange={handleChange}
					/>
					<input
						type="password"
						name="cvv"
						className="form-control mb-2"
						placeholder="CVV"
						value={paymentDetails.cvv}
						onChange={handleChange}
					/>
				</div>
				<div className="modal-footer">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleSubmit}
					>
						Submit
					</button>
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddPaymentModal;
