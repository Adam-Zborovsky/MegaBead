import { Link } from "react-router-dom";
import { GiPrayerBeads } from "react-icons/gi";
import { FaStore, FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

const Home = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="container py-5">
			<div className="row align-items-center mb-5">
				<div className="col text-center text-md-start md-6">
					<h1 className="display-4 fw-bold">Design Your Custom Necklace</h1>
					<p className="lead">
						Create beautiful bead jewelry with our intuitive builder.
					</p>
					<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
						<Link
							to={isMobile ? "#" : "/builder"}
							className={`btn btn-primary btn-lg rounded-pill ${
								isMobile ? "disabled" : ""
							}`}
						>
							Builder
						</Link>
						<Link
							to="/products"
							className="btn btn-secondary btn-lg rounded-pill"
						>
							Shop Ready-Made
						</Link>
					</div>
				</div>
				<div className="col text-center md-6">
					<div className="bg-light rounded p-5">
						<GiPrayerBeads size={150} />
					</div>
				</div>
			</div>

			<div className="row text-center">
				<div className="col mb-4">
					<div className="card h-100 border-0 rounded shadow-sm">
						<div>
							<GiPrayerBeads size={50} className="mb-3 text-primary" />
							<h2>Intuitive Builder</h2>
							<div>Drag & drop beads to design your piece.</div>
							{isMobile && <div>(Desktop only For Now....)</div>}
						</div>
					</div>
				</div>
				<div className="col mb-4 md-4">
					<div className="card h-100 border-0 rounded shadow-sm">
						<div>
							<FaStore size={50} className="mb-3 text-primary" />
							<h2>Ready-Made Shop</h2>
							<p>Browse handcrafted necklaces & bracelets.</p>
						</div>
					</div>
				</div>
				<div className="col mb-4 md-4 ">
					<div className="card h-100 border-0 rounded shadow-sm">
						<div>
							<FaHeart size={50} className="mb-3 text-danger" />
							<h2>Meaningful Craft</h2>
							<p2>Inspired by personal stories & therapy.</p2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
