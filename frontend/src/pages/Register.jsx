<<<<<<< HEAD
function Register() {
	return (
		<div className="container py-4">
			<div className="row justify-content-center">
				<div className="col-md-6 window">
					<h2 className="mb-4 text-primary">Register</h2>
					<form>
						<div className="mb-3">
							<label className="form-label">Name</label>
							<input
								type="text"
								className="form-control"
								placeholder="Your name"
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control"
								placeholder="you@example.com"
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								placeholder="••••••••"
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100">
							Register
						</button>
					</form>
				</div>
			</div>
		</div>
=======
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
>>>>>>> 6b0a13c2f13a4e82d05cacf06a8cf669b8e7ca3e
	);
}
export default Register;
