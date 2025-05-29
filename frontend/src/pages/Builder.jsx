import { useState, useEffect } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";
import BeadList from "../components/BeadList";
import LengthOptions from "../components/LengthOptions";

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
		<div className="d-flex justify-content-center" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div style={{ width: "400px" }}>
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
			<div className=" d-flex flex-column justify-content-start align-items-center">
				<Necklace beads={necklaceBeads} length={necklaceLength} />
				<LengthOptions
					length={necklaceLength}
					onLengthChange={setNecklaceLength}
				/>
			</div>

			{/* Right: Bead Selection */}
			<div className="" style={{ overflowY: "auto", width: "400px" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
