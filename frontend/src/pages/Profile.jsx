import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser, deleteUser } from "../services/userService";
import { toast } from "react-toastify";
import AddShippingModal from "../components/AddShippingModal";
import AddPaymentModal from "../components/AddPaymentModal";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Profile = () => {
	const { user, token, logout } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		name: `${user?.name?.first || ""} ${user?.name?.last || ""}`,
		email: user?.email || "",
		shippingOptions: user?.shippingOptions || [],
		paymentOptions: user?.paymentOptions || [],
	});

	const [showShippingModal, setShowShippingModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleUpdate = async () => {
		try {
			const updatedUser = {
				name: {
					first: formData.name.split(" ")[0],
					last: formData.name.split(" ")[1],
				},
				email: formData.email,
				shippingOptions: formData.shippingOptions,
				paymentOptions: formData.paymentOptions,
			};
			await updateUser(updatedUser, token);
			toast.success("Profile updated successfully!");
		} catch (error) {
			toast.error("Failed to update profile.");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteUser(token);
			toast.success("Profile deleted successfully!");
			logout();
		} catch (error) {
			toast.error("Failed to delete profile.");
		}
	};

	if (!user) {
		return (
			<div className="text-center mt-5">
				Please log in to access your profile.
			</div>
		);
	}

	return (
		<div className="container d-flex justify-content-center align-items-center my-4">
			<div className="card shadow-lg p-4" style={{ width: "400px" }}>
				<h2 className="text-center mb-4">Profile</h2>
				<form>
					<div className="mb-3">
						<label className="form-label">Name</label>
						<input
							type="text"
							name="name"
							className="form-control"
							value={formData.name}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Email</label>
						<input
							type="email"
							name="email"
							className="form-control"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Shipping Options</label>
						<select className="form-select mb-2">
							<option value="">Select Address</option>
							{formData.shippingOptions.map((option, index) => (
								<option key={index} value={option.addressLine1}>
									{option.addressLine1}
								</option>
							))}
						</select>
						<button
							type="button"
							className="btn btn-link p-0"
							onClick={() => setShowShippingModal(true)}
						>
							<FaPlus />
						</button>
					</div>
					<div className="mb-3">
						<label className="form-label">Payment Options</label>
						<select className="form-select mb-2">
							<option value="">Select Card</option>
							{formData.paymentOptions.map((option, index) => (
								<option key={index} value={option.cardHolderName}>
									{option.cardHolderName}
								</option>
							))}
						</select>
						<button
							type="button"
							className="btn btn-link p-0"
							onClick={() => setShowPaymentModal(true)}
						>
							<FaPlus />
						</button>
					</div>
					<div className="d-flex justify-content-between">
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleUpdate}
						>
							Update
						</button>
						<button
							type="button"
							className="btn btn-danger"
							onClick={handleDelete}
						>
							Delete
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleLogout}
						>
							Log Out
						</button>
					</div>
				</form>
			</div>
			{showShippingModal && (
				<AddShippingModal onClose={() => setShowShippingModal(false)} />
			)}
			{showPaymentModal && (
				<AddPaymentModal onClose={() => setShowPaymentModal(false)} />
			)}
		</div>
	);
};

export default Profile;
