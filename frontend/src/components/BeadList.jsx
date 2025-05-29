import "../style/BeadList.css";

function BeadList({ beads, onRemoveBead, isFull }) {
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

	return (
		<div className="card shadow-sm" style={{ margin: "2rem auto" }}>
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
									// Remove the last bead from this group:
									// Its index = startIndex + count - 1
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
						<button className="btn btn-sm btn-primary">Add To Cart</button>
					)}
					<button className="btn btn-sm btn-danger">Reset</button>
				</div>
			</ul>
		</div>
	);
}

export default BeadList;
