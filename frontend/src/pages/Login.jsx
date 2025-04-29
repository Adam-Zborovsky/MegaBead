import { Form, Button, Card } from "react-bootstrap";

function Login() {
	return (
		<Card className="mx-auto" style={{ maxWidth: "400px" }}>
			<Card.Body>
				<Card.Title className="mb-3">Login</Card.Title>
				<Form>
					<Form.Group className="mb-3" controlId="loginEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="you@example.com" />
					</Form.Group>
					<Form.Group className="mb-3" controlId="loginPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="••••••" />
					</Form.Group>
					<Button variant="primary" type="submit" className="w-100">
						Sign In
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}
export default Login;
