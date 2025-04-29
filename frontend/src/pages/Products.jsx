import { Link } from "react-router-dom";

const dummyProducts = [
	{
		id: "1",
		name: "Leather necklace",
		price: "$45",
		image: "/images/necklace.jpg",
		type: "necklace",
	},
	{
		id: "2",
		name: "Wooden Bead Bracelet",
		price: "$30",
		image: "/images/bracelet.jpg",
		type: "bracelet",
	},
	// …your real data later
];

function Products() {
	return (
		<div className="container py-4">
			<div className="row gy-4 py-4">
				{dummyProducts.map((p) => (
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
