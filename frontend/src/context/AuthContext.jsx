import { createContext, useState, useEffect } from "react";
import { getUserById } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);

	useEffect(() => {
		const fetchUser = async () => {
			if (token) {
				try {
					const decoded = jwtDecode(token);
					if (decoded.exp * 1000 < Date.now()) {
						localStorage.removeItem("token");
						setToken(null);
						setUser(null);
						return;
					}
					const userData = await getUserById(decoded._id);
					setUser(userData.data);
					setToken(token);
				} catch (error) {
					console.error("Failed to fetch user data", error);
					setUser(null);
				}
			}
		};
		fetchUser();
	}, [token]);

	const login = async (newToken) => {
		try {
			localStorage.setItem("token", newToken);
			setToken(newToken);
			const userData = await getUserById(jwtDecode(newToken)._id, newToken);
			setUser(userData.data);
			toast.success("Login successful!");
		} catch (error) {
			toast.error("Login failed.");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
