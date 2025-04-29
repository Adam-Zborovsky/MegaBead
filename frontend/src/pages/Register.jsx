import { Form, Button, Card } from "react-bootstrap";

function Register() {
	return (
		<Card className="mx-auto" style={{ maxWidth: "400px" }}>
			<Card.Body>
				<Card.Title className="mb-3">Register</Card.Title>
				<Form>
					<Form.Group className="mb-3" controlId="regName">
						<Form.Label>Name</Form.Label>
						<Form.Control type="text" placeholder="Your Name" />
					</Form.Group>
					<Form.Group className="mb-3" controlId="regEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="you@example.com" />
					</Form.Group>
					<Form.Group className="mb-3" controlId="regPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="••••••" />
					</Form.Group>
					<Button variant="primary" type="submit" className="w-100">
						Create Account
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}
export default Register;
