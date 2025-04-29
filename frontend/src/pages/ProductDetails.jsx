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
