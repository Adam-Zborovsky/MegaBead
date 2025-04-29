import {
	Navbar,
	Nav,
	Button,
	Form,
	FormControl,
	Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../style/MainNav.css";
import { CiSearch } from "react-icons/ci";

export default function MainNav() {
	return (
		<Navbar expand="lg" className="custom-navbar mb-4">
			<Container fluid="md">
				<Navbar.Brand as={Link} to="/" className="me-4">
					MyStore
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="nav-collapse" />
				<Navbar.Collapse id="nav-collapse">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/">
							All Products
						</Nav.Link>
						<Nav.Link as={Link} to="/categories">
							Categories
						</Nav.Link>
						<Nav.Link as={Link} to="/builder">
							Builder
						</Nav.Link>
					</Nav>

					<Form className="d-flex align-items-center me-3">
						<FormControl
							type="search"
							placeholder="Search…"
							className="me-2 form-pill"
						/>
						<Button variant="secondary" className="btn-pill btn-search">
							<CiSearch size={25} />
						</Button>
					</Form>

					<Nav className="align-items-center">
						<Button
							as={Link}
							to="/login"
							variant="light"
							className="btn-pill btn-login me-2"
						>
							Login
						</Button>
						<Button
							as={Link}
							to="/register"
							variant="secondary"
							className="btn-pill"
						>
							Sign Up
						</Button>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
