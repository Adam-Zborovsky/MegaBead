import { useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function Products() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");

	// placeholder data
	const products = [
		{
			id: 1,
			name: "Necklace A",
			price: "$49",
			img: "https://via.placeholder.com/150",
		},
		{
			id: 2,
			name: "Charm B",
			price: "$29",
			img: "https://via.placeholder.com/150",
		},
		// …
	];

	const filtered = products.filter(
		(p) =>
			p.name.toLowerCase().includes(search.toLowerCase()) &&
			(!category || p.category === category)
	);

	return (
		<>
			<Form className="d-flex mb-4">
				<Form.Control
					type="search"
					placeholder="Search products…"
					className="me-2"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Form.Select
					style={{ maxWidth: "200px" }}
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="">All Categories</option>
					<option value="necklace">Necklaces</option>
					<option value="charm">Charms</option>
				</Form.Select>
			</Form>

			<Row xs={1} sm={2} md={3} lg={4} className="g-4">
				{filtered.map((p) => (
					<Col key={p.id}>
						<Card>
							<Card.Img variant="top" src={p.img} />
							<Card.Body>
								<Card.Title>{p.name}</Card.Title>
								<Card.Text>{p.price}</Card.Text>
								<Button
									as={Link}
									to={`/products/${p.id}`}
									variant="primary"
									className="w-100"
								>
									View
								</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
}
export default Products;
