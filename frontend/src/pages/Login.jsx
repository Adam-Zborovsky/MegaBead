import { useState, useContext } from "react";
import { loginUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		loginUser(formData.email, formData.password)
			.then((res) => {
				login(res.data.token);
				navigate("/");
			})
			.catch((error) => {
				console.error("Login failed:", error);
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
				<h2 className="text-primary">Login</h2>
				<form onSubmit={handleSubmit}>
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
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
