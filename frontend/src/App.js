import { BrowserRouter as Router, Routes, Route } from "react-router";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Builder from "./pages/Builder";

function App() {
	return (
		<Router>
			<NavBar />
			<Routes>
				<Route path="/" element={<Products />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductDetails />} />
				<Route path="/builder" element={<Builder />} />
			</Routes>
		</Router>
	);
}
export default App;
