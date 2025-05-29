import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productServices";

function Products() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		getAllProducts()
			.then((res) => {
				if (res.data.length > 0) {
					setProducts(res.data);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch products:", err);
			});
	}, []);

	return (
		<div className="container py-4">
			<div className="row gy-4 py-4">
				{products.map((p) => (
					<div key={p.id} className="col-md-4">
						<div className="window text-center">
							<img src={p.image} alt={p.name} className="img-fluid mb-3" />
							<h5 className="text-primary">{p.name}</h5>
							<p className="text-secondary">{p.price}</p>
							<Link to={`/products/${p.id}`} className="btn btn-primary">
								View Details
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
export default Products;
