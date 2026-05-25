import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Bounce, ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Eagerly load Home and NotFound for fastest first paint
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load everything else
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ProductUpload = lazy(() => import("./pages/ProductUpload"));
const Builder = lazy(() => import("./pages/Builder"));
const Profile = lazy(() => import("./pages/Profile"));
const Cart = lazy(() => import("./pages/Cart"));
const ManageProducts = lazy(() => import("./pages/ManageProducts"));

function PageSkeleton() {
	return (
		<div className="min-h-[50vh] bg-bone px-4 py-16 md:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="h-8 w-1/3 animate-pulse rounded bg-linen" />
				<div className="h-4 w-2/3 animate-pulse rounded bg-linen" />
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[0, 1, 2].map((i) => (
						<div key={i} className="animate-pulse space-y-4 rounded-lg bg-linen p-4">
							<div className="aspect-square rounded-md bg-bone" />
							<div className="h-4 w-2/3 rounded bg-bone" />
							<div className="h-4 w-1/3 rounded bg-bone" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

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
					transition={Bounce}
					className="!font-sans"
					toastClassName="!bg-bone !text-clay !border !border-linen !rounded-lg !shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
					bodyClassName="!text-sm !font-medium"
					progressClassName="!bg-terracotta"
				/>
				<div className="main-wrapper">
					<Router>
						<a
							href="#main-content"
							className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-terracotta focus:px-4 focus:py-2 focus:text-white"
						>
							Skip to main content
						</a>
						<Navbar />
						<ErrorBoundary>
							<main id="main-content">
								<Suspense fallback={<PageSkeleton />}>
									<Routes>
										<Route path="/" element={<Home />} />
										<Route path="/products" element={<Products />} />
										<Route path="/login" element={<Login />} />
										<Route path="/register" element={<Register />} />
										<Route path="/product/:id" element={<ProductDetails />} />
										<Route
											path="/manage_products"
											element={
												<ProtectedRoute>
													<ManageProducts />
												</ProtectedRoute>
											}
										/>
										<Route
											path="/create_product"
											element={
												<ProtectedRoute>
													<ProductUpload />
												</ProtectedRoute>
											}
										/>
										<Route
											path="/edit_product/:id"
											element={
												<ProtectedRoute>
													<ProductUpload />
												</ProtectedRoute>
											}
										/>
										<Route
											path="/profile"
											element={
												<ProtectedRoute>
													<Profile />
												</ProtectedRoute>
											}
										/>
										<Route
											path="/cart"
											element={
												<ProtectedRoute>
													<Cart />
												</ProtectedRoute>
											}
										/>
										<Route path="/builder" element={<Builder />} />
										<Route path="*" element={<NotFound />} />
									</Routes>
								</Suspense>
							</main>
						</ErrorBoundary>
						<Footer />
					</Router>
				</div>
			</CartProvider>
		</AuthProvider>
	);
}
export default App;
