import { useEffect, useState } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";
import BeadList from "../components/BeadList";
import NecklaceLengthOptions from "../components/NecklaceLengthOptions";

function Builder() {
	const [necklaceBeads, setNecklaceBeads] = useState([]);
	const [isFull, setIsFull] = useState(false);
	const [necklaceLength, setNecklaceLength] = useState(42);
	const maxCapacity = Math.floor((necklaceLength / 10) * 35);

	const addBeadToNecklace = (bead) => {
		if (necklaceBeads.length < maxCapacity) {
			setNecklaceBeads((prev) => [...prev, bead]);
		} else {
			setIsFull(true);
		}
	};
	useEffect(() => {
		setNecklaceBeads([]);
	}, [necklaceLength]);
	return (
		<div className="row g-0" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div className="col-md-2" style={{ overflowY: "auto" }}>
				<BeadList beads={necklaceBeads} isFull={isFull} />
			</div>

			{/* Center: Necklace & length card */}
			<div className="col-md-7 d-flex flex-column justify-content-start align-items-center">
				{/* The necklace area (fills remaining vertical space) */}

				<Necklace beads={necklaceBeads} length={necklaceLength} />
				<NecklaceLengthOptions
					length={necklaceLength}
					onLengthChange={setNecklaceLength}
				/>
			</div>

			<div className="col-md-3" style={{ overflowY: "auto", height: "100vh" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
