// Builder.js
import { useState } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";

function Builder() {
	const [necklaceBeads, setNecklaceBeads] = useState([]);

	const addBeadToNecklace = (bead) => {
		setNecklaceBeads((prev) => [...prev, bead]);
	};

	return (
		<div className="row g-0" style={{ height: "100vh" }}>
			{/* LEFT: Necklace, centered and non-scrollable */}
			<div
				className="col-md-8 d-flex justify-content-center align-items-center"
				style={{ overflow: "hidden" }}
			>
				<Necklace beads={necklaceBeads} />
			</div>

			{/* RIGHT: Bead selection, scrollable */}
			<div className="col-md-4" style={{ overflowY: "auto", height: "100vh" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
