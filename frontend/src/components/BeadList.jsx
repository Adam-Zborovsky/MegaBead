import { toast } from "react-toastify";
import "../style/BeadList.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function BeadList({ beads, onRemoveBead, handleReset, isFull, onAddToCart }) {
	const { user } = useContext(AuthContext);

	const groups = [];
	beads.forEach((bead, idx) => {
		if (
			groups.length === 0 ||
			groups[groups.length - 1].bead.name !== bead.name
		) {
			groups.push({ bead, count: 1, startIndex: idx });
		} else {
			groups[groups.length - 1].count++;
		}
	});

	const handleAddToCart = () => {
		if (user) {
			onAddToCart();
		} else {
			toast.error("Please log in to add items to the cart.");
		}
	};

	return (
		<div className="card shadow-sm" style={{ border: "none", padding: "5px" }}>
			<div className="card-header">
				<h5 className="card-title mb-0">Bead List</h5>
			</div>
			<ul className="list-group list-group-flush">
				{groups.map((group, index) => (
					<li
						key={index}
						className="list-group-item d-flex justify-content-between align-items-center"
					>
						<span>{group.bead.name}</span>
						<span className="position-relative">
							<span className="badge bg-secondary count-badge">
								{group.count}
							</span>
							<button
								className="btn btn-sm btn-danger remove-btn"
								onClick={(e) => {
									e.stopPropagation();
									const removeIndex = group.startIndex + group.count - 1;
									onRemoveBead(removeIndex);
								}}
							>
								X
							</button>
						</span>
					</li>
				))}
				<div className="card-footer d-flex justify-content-around">
					{isFull && (
						<button
							className="btn btn-sm btn-primary"
							onClick={handleAddToCart}
						>
							{user ? "Add To Cart" : "Log in to Add to Cart"}
						</button>
					)}
					<button className="btn btn-sm btn-danger" onClick={handleReset}>
						Reset
					</button>
				</div>
			</ul>
		</div>
	);
}

export default BeadList;
