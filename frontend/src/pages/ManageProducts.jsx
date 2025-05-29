import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/productServices";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ManageProducts = () => {
	const [products, setProducts] = useState([]);
	const { token } = useContext(AuthContext);

	useEffect(() => {
		getAllProducts()
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch products", err);
			});
	}, []);

	const handleDelete = async (productId) => {
		console.log("Deleting product with ID:", productId);
		deleteProduct(productId, token)
			.then(() => {
				setProducts(products.filter((product) => product.id !== productId));
				toast.success("Product deleted successfully");
				window.location.reload();
			})
			.catch((error) => {
				console.error("Failed to delete product", error);
			});
	};

	return (
		<div className="container mt-5">
			<h2 className="text-primary">Manage Products</h2>
			<div className="row">
				{products.map((product) => (
					<div className="col-md-4 mb-4" key={product._id}>
						<div className="card">
							{product.image ? (
								<img
									src={`${process.env.REACT_APP_API_URL}images/${product.image}`}
									alt={product.name}
									className="img-fluid mb-3"
								/>
							) : (
								<img
									src={`/images/default_${product.type}.png`}
									alt={product.name}
									className="img-fluid mb-3"
								/>
							)}
							<div className="card-body">
								<h5 className="card-title">{product.name}</h5>
								<p className="card-text">{product.description}</p>
								<p className="card-text">Price: {product.price}</p>
								<div className="d-flex justify-content-between">
									<button
										className="btn btn-danger me-2"
										onClick={() => handleDelete(product._id)}
									>
										Delete
									</button>
									<Link
										to={`/edit_product/${product._id}`}
										className="btn btn-primary"
									>
										Edit
									</Link>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="d-flex justify-content-center">
				<Link
					to="/create_product"
					className="btn btn-primary"
					style={{ backgroundColor: "#3b5998" }}
				>
					Upload New Product
				</Link>
			</div>
		</div>
	);
};

export default ManageProducts;
