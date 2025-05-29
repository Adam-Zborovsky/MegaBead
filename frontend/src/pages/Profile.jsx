import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser, deleteUser } from "../services/userServices";
import { toast } from "react-toastify";

const Profile = () => {
	const { user, token, logout } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		name: `${user.name.first} ${user.name.last}`,
		email: user.email,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleUpdate = async () => {
		try {
			const updatedUser = {
				name: {
					first: formData.name.split(" ")[0],
					last: formData.name.split(" ")[1],
				},
				email: formData.email,
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
					</div>
				</form>
			</div>
		</div>
	);
};

export default Profile;
