<<<<<<< HEAD
import { useParams } from "react-router";

function ProductDetail() {
	const { id } = useParams();
	// replace this stub with real data fetch
	const product = {
		id,
		name: `Product #${id}`,
		price: "$99",
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
=======
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

function ProductDetails() {
	const { id } = useParams();
	// TODO: fetch real product by id
	const product = {
		id,
		name: "Necklace A",
		price: "$49",
		img: "https://via.placeholder.com/300",
		desc: "A lovely custom necklace.",
	};

	return (
		<Card className="mx-auto" style={{ maxWidth: "600px" }}>
			<Card.Img variant="top" src={product.img} />
			<Card.Body>
				<Card.Title>{product.name}</Card.Title>
				<Card.Text>{product.desc}</Card.Text>
				<h4 className="mb-3">{product.price}</h4>
				<Button variant="primary" className="me-2">
					Add to Cart
				</Button>
				<Button variant="secondary">Back to Products</Button>
			</Card.Body>
		</Card>
	);
}
export default ProductDetails;
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e
