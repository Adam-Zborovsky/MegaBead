import { BrowserRouter as Router, Routes, Route } from "react-router";
<<<<<<< HEAD
import NavBar from "./components/Navbar";
=======
import { Container } from "react-bootstrap";

import MainNav from "./components/MainNav";
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
<<<<<<< HEAD
import Builder from "./pages/Builder";
=======
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e

function App() {
	return (
		<Router>
<<<<<<< HEAD
			<NavBar />
			<Routes>
				<Route path="/" element={<Products />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductDetails />} />
				<Route path="/builder" element={<Builder />} />
			</Routes>
=======
			<MainNav />
			<Container className="py-4">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route path="/" element={<Products />} />
				</Routes>
			</Container>
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e
		</Router>
	);
}
export default App;
