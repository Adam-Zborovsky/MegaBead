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
import { CartProvider } from "./context/CartContext";
import { Bounce, ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import ManageProducts from "./pages/ManageProducts";
import Home from "./pages/Home";

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					transition={Bounce}
				/>
				<div className="main-wrapper">
					<Router>
						<NavBar />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/products" element={<Products />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/products" element={<Products />} />
							<Route path="/product/:id" element={<ProductDetails />} />
							<Route path="/manage_products" element={<ManageProducts />} />
							<Route path="/create_product" element={<ProductUpload />} />
							<Route path="/edit_product/:id" element={<ProductUpload />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/builder" element={<Builder />} />
						</Routes>
					</Router>
				</div>
			</CartProvider>
		</AuthProvider>
	);
}
export default App;
