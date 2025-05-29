import { useParams } from "react-router";

function ProductDetail() {
	const { id } = useParams();
	// replace this stub with real data fetch
	const product = {
		id,
		name: `Product #${id}`,
		price: "$99",
		type: "necklace", // or bracelet
		image: `/images/product${id}.jpg`,
		description: "Here is a detailed description of your product.",
	};

	return (
		<div className="container py-4">
			<div className="window">
				<div className="row">
					<div className="col-md-6">
						<img src={product.image} alt={product.name} className="img-fluid" />
					</div>
					<div className="col-md-6">
						<h2 className="text-primary">{product.name}</h2>
						<div className="d-flex gap-5	 mb-4">
							<p className="text-secondary ">{product.price}</p>
							<p className="text-secondary ">{product.price}</p>
						</div>
						<p className="mb-4">{product.description}</p>
						<button className="btn btn-primary">Add to Cart</button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ProductDetail;
