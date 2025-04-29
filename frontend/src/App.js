import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Container } from "react-bootstrap";

import MainNav from "./components/MainNav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

function App() {
	return (
		<Router>
			<MainNav />
			<Container className="py-4">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/products/:id" element={<ProductDetails />} />
					<Route path="/" element={<Products />} />
				</Routes>
			</Container>
		</Router>
	);
}
export default App;
