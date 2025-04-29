import { Link } from "react-router-dom";
import "../style/Navbar.css";
function NavBar() {
	return (
		<nav className="navbar custom-navbar navbar-expand-lg bg-primary">
			<div className="container">
				<Link className="navbar-brand text-white" to="/">
					MyStore
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navMenu"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navMenu">
					<div className="d-flex space-around align-items-center me-auto">
						<Link className="nav-link" to="/">
							All Products
						</Link>
						<Link className="nav-link" to="/categories">
							Categories
						</Link>
						<Link className="nav-link" to="/builder">
							Builder
						</Link>
					</div>
					<div className="d-flex space-between">
						<form className="d-flex align-items-center me-3">
							<input
								className="form-control me-2 form-pill"
								type="search"
								placeholder="Search..."
								aria-label="Search"
							/>
							<button className="btn btn-secondary btn-pill" type="submit">
								Search
							</button>
						</form>

						<ul className="navbar-nav ms-auto">
							<li className="nav-item">
								<Link
									className="nav-link btn-pill btn-login text-white"
									to="/login"
								>
									Login
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link btn-pill text-white" to="/register">
									Register
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
}
export default NavBar;
