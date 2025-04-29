<<<<<<< HEAD
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
=======
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
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e
	);
}
export default Products;
