import { BrowserRouter as Router, Routes, Route } from "react-router";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/ProductUpload";
import Builder from "./pages/Builder";
import AuthProvider from "./context/AuthContext";
import Profile from "./pages/Profile";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Products />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/products" element={<Products />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route path="/create_product" element={<ProductUpload />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/builder" element={<Builder />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}
export default App;
