// Builder.jsx
import { useState } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";
import BeadList from "../components/BeadList";
import NecklaceLengthOptions from "../components/NecklaceLengthOptions";

function Builder() {
	const [necklaceBeads, setNecklaceBeads] = useState([]);
	// Default length is 42 cm
	const [necklaceLength, setNecklaceLength] = useState(42);

	const addBeadToNecklace = (bead) => {
		setNecklaceBeads((prev) => [...prev, bead]);
	};

	return (
		<div className="row g-0" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div className="col-md-3 p-3" style={{ overflowY: "auto" }}>
				<BeadList beads={necklaceBeads} />
			</div>

			{/* Center: Necklace & length card */}
			<div
				className="col-md-6 d-flex flex-column justify-content-start align-items-center"
				style={{ overflow: "hidden" }}
			>
				{/* The necklace area (fills remaining vertical space) */}
				<div className="flex-grow-1 d-flex justify-content-center align-items-center">
					<Necklace beads={necklaceBeads} length={necklaceLength} />
				</div>

				{/* The length options card, displayed underneath the necklace */}
				<div className="w-100" style={{ maxWidth: "600px" }}>
					<NecklaceLengthOptions
						length={necklaceLength}
						onLengthChange={setNecklaceLength}
					/>
				</div>
			</div>

			{/* Right: Bead Selection */}
			<div className="col-md-3" style={{ overflowY: "auto", height: "100vh" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
