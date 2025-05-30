import { Link } from "react-router-dom";
import "../style/Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
	FaHome,
	FaUser,
	FaShoppingCart,
	FaSignInAlt,
	FaUserPlus,
	FaShoppingBag,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

function NavBar() {
	const { user } = useContext(AuthContext);
	return (
		<nav className="navbar custom-navbar bg-primary">
			<div className="container d-flex justify-content-between align-items-center">
				<Link className="navbar-brand text-white" to="/">
					Mega Bead
				</Link>

				<div className="desktop-nav d-flex align-items-center">
					<Link className="nav-link text-white" to="/products">
						Shop
					</Link>

					<Link className="nav-link text-white" to="/builder">
						Builder
					</Link>
					{user && user.isAdmin && (
						<Link className="nav-link text-white" to="/manage_products">
							Manage Products
						</Link>
					)}
					{user ? (
						<>
							<Link className="nav-link text-white" to="/profile">
								Profile
							</Link>
							<Link className="nav-link text-white" to="/cart">
								Cart
							</Link>
						</>
					) : (
						<>
							<Link className="nav-link text-white" to="/login">
								Login
							</Link>
							<Link className="nav-link text-white" to="/register">
								Register
							</Link>
						</>
					)}
				</div>

				<div className="mobile-nav d-flex align-items-center">
					<Link className="nav-link text-white" to="/">
						<FaHome />
					</Link>
					<Link className="nav-link text-white" to="/products">
						<FaShoppingBag />
					</Link>
					{user && user.isAdmin && (
						<Link className="nav-link text-white" to="/manage_products">
							<MdAdminPanelSettings />
						</Link>
					)}
					{user ? (
						<>
							<Link className="nav-link text-white" to="/profile">
								<FaUser />
							</Link>
							<Link className="nav-link text-white" to="/cart">
								<FaShoppingCart />
							</Link>
						</>
					) : (
						<>
							<Link className="nav-link text-white" to="/login">
								<FaSignInAlt />
							</Link>
							<Link className="nav-link text-white" to="/register">
								<FaUserPlus />
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
export default NavBar;
