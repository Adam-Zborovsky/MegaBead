import { useState, useEffect } from "react";
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
		const uniqueBead = { ...bead, id: Date.now() + Math.random() };
		if (necklaceBeads.length < maxCapacity) {
			setNecklaceBeads((prev) => [...prev, uniqueBead]);
		} else {
			alert("Necklace is full!");
		}
	};

	const removeBeadFromNecklace = (removeIndex) => {
		setNecklaceBeads((prev) => {
			const newArr = [...prev];
			newArr.splice(removeIndex, 1);
			return newArr;
		});
		setIsFull(false);
	};

	const handleaddToCart = () => {};

	useEffect(() => {
		setNecklaceBeads([]);
	}, [necklaceLength]);

	return (
		<div className="row g-0 p-0" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div className="col-md-3 p-3" style={{ overflowY: "auto" }}>
				<BeadList
					beads={necklaceBeads}
					onRemoveBead={removeBeadFromNecklace}
					isFull={isFull}
					onReset={() => {
						setNecklaceBeads([]);
						setIsFull(false);
					}}
					onAddToCart={() => {
						setNecklaceBeads([]);
						setIsFull(false);
					}}
				/>
			</div>

			{/* Center: Necklace & length card */}
			<div className="col-md-7 d-flex flex-column justify-content-start align-items-center">
				<Necklace beads={necklaceBeads} length={necklaceLength} />
				<NecklaceLengthOptions
					length={necklaceLength}
					onLengthChange={setNecklaceLength}
				/>
			</div>

			{/* Right: Bead Selection */}
			<div className="col-md-2" style={{ overflowY: "auto", height: "100vh" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
