import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { NecklaceIcon } from "../customIcons/NecklaceIcon";
import { BraceletIcon } from "../customIcons/BraceletIcon";

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
					<div key={p._id} className="col-md-4">
						<div className="card text-center">
							{p.image ? (
								<img
									src={`${process.env.REACT_APP_API_URL}images/${p.image}`}
									alt={p.name}
									className="img-fluid mb-3 rounded-5"
								/>
							) : (
								<img
									src={`/images/default_${p.type}.png`}
									alt={p.name}
									className="img-fluid mb-3 rounded-5"
								/>
							)}
							<div className="d-flex justify-content-center gap-3 ">
								<h5 className="text-primary ">{p.name}</h5>
								{p.type === "necklace" ? <NecklaceIcon /> : <BraceletIcon />}
							</div>
							<p className="text-secondary">{p.price}</p>
							<Link to={`/product/${p._id}`} className="btn btn-primary">
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
