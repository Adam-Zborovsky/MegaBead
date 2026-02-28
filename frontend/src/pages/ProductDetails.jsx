import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductById } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { NecklaceIcon } from "../customIcons/NecklaceIcon";
import { BraceletIcon } from "../customIcons/BraceletIcon";

function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const { addItemToCart } = useContext(CartContext);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		getProductById(id)
			.then((res) => {
				setProduct(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch product details:", err);
			});
	}, [id]);

	const handleAddToCart = () => {
		if (user) {
			const item = { productId: product._id, quantity: 1 };
			addItemToCart(item);
		}
	};

	if (!product) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container py-4">
			<div className="window">
				<div className="row">
					<div className="col-md-6">
						{product.image ? (
							<img
								src={`${process.env.REACT_APP_API_URL}/images/${product.image}`}
								alt={product.name}
								className="img-fluid mb-3  rounded-5"
							/>
						) : (
							<img
								src={`/images/default_${product.type}.png`}
								alt={product.name}
								className="img-fluid mb-3  rounded-5"
							/>
						)}
					</div>
					<div className="col-md-6">
						<div className="d-flex align-items-center gap-3 ">
							<h2 className="text-primary ">{product.name}</h2>
							{product.type === "necklace" ? (
								<NecklaceIcon size={40} />
							) : (
								<BraceletIcon size={40} />
							)}
						</div>
						<div className="d-flex gap-5 mb-4">
							<p className="text-secondary">{product.price}</p>
						</div>
						<p className="mb-4">{product.description}</p>
						<button className="btn btn-primary" onClick={handleAddToCart}>
							{user ? "Add to Cart" : "Log in to Add to Cart"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetail;
