import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import "../style/Modal.css";

const AddShippingModal = ({ onClose }) => {
	const { user, token } = useContext(AuthContext);
	const [shippingAddress, setShippingAddress] = useState({
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setShippingAddress((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		const updatedShippingOptions = [...user.shippingOptions, shippingAddress];
		updateUser(user._id, { shippingOptions: updatedShippingOptions }, token)
			.then(() => {
				toast.success("Shipping options updated successfully!");
				onClose();
			})
			.catch(() => {
				toast.error("Failed to update shipping options.");
			});
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h5 className="modal-title">Add Shipping Address</h5>
					<button
						type="button"
						className="btn-close"
						onClick={onClose}
					></button>
				</div>
				<div className="modal-body">
					<input
						type="text"
						name="addressLine1"
						className="form-control mb-2"
						placeholder="Address Line 1"
						value={shippingAddress.addressLine1}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="addressLine2"
						className="form-control mb-2"
						placeholder="Address Line 2"
						value={shippingAddress.addressLine2}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="city"
						className="form-control mb-2"
						placeholder="City"
						value={shippingAddress.city}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="state"
						className="form-control mb-2"
						placeholder="State"
						value={shippingAddress.state}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="postalCode"
						className="form-control mb-2"
						placeholder="Postal Code"
						value={shippingAddress.postalCode}
						onChange={handleChange}
					/>
					<input
						type="text"
						name="country"
						className="form-control mb-2"
						placeholder="Country"
						value={shippingAddress.country}
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

export default AddShippingModal;
