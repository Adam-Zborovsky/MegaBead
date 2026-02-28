import { useState, useContext } from "react";
import { registerUser, loginUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: {
			first: "",
			last: "",
		},
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "first" || name === "last") {
			setFormData({
				...formData,
				name: { ...formData.name, [name]: value },
			});
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		registerUser(formData)
			.then((res) => {
				loginUser(formData.email, formData.password)
					.then((loginResponse) => {
						if (loginResponse.data.token) {
							login(loginResponse.data.token);
							navigate("/");
						}
					})
					.catch((err) => {
						console.error("Login after registration failed:", err);
					});
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div className="container mt-5 d-flex justify-content-center">
			<div
				className="p-4 bg-light"
				style={{
					borderRadius: "0.5rem",
					boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<h2 className="text-primary">Register</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="first" className="form-label">
							First Name
						</label>
						<input
							type="text"
							id="first"
							name="first"
							className="form-control"
							value={formData.name.first}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="last" className="form-label">
							Last Name
						</label>
						<input
							type="text"
							id="last"
							name="last"
							className="form-control"
							value={formData.name.last}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="form-control"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="form-control"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary w-100">
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
