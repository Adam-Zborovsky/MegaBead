import { useState, useEffect, useContext } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";
import BeadList from "../components/BeadList";
import LengthOptions from "../components/LengthOptions";
import { CartContext } from "../context/CartContext";

function Builder() {
	const [necklaceBeads, setNecklaceBeads] = useState([]);
	const [isFull, setIsFull] = useState(false);
	const [necklaceLength, setNecklaceLength] = useState(42);
	const { addCustomItemToCart } = useContext(CartContext);
	const maxCapacity = Math.floor((necklaceLength / 10) * 35);

	const addBeadToNecklace = (bead) => {
		const uniqueBead = { ...bead, id: Date.now() + Math.random() };
		if (necklaceBeads.length < maxCapacity) {
			setNecklaceBeads((prev) => [...prev, uniqueBead]);
		} else {
			setIsFull(true);
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

	const handleAddToCart = async () => {
		// Generate product description
		const beadCounts = necklaceBeads.reduce((acc, bead) => {
			acc[bead.name] = (acc[bead.name] || 0) + 1;
			return acc;
		}, {});
		const description = Object.entries(beadCounts)
			.map(([name, count]) => `${name}: ${count}`)
			.join("\n");

		const productData = {
			name: `Custom ${necklaceLength > 25 ? "necklace" : "bracelet"}`,
			price: `${necklaceLength * 1.5} ₪`,
			type: necklaceLength > 25 ? "necklace" : "bracelet",
			description,
		};

		addCustomItemToCart(productData, 1);
	};
	const handleReset = () => {
		setNecklaceBeads([]);
		setIsFull(false);
	};
	useEffect(() => {
		setNecklaceBeads([]);
	}, [necklaceLength]);

	return (
		<div className="d-flex justify-content-center" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div style={{ width: "400px", marginLeft: "75px" }}>
				<BeadList
					beads={necklaceBeads}
					onRemoveBead={removeBeadFromNecklace}
					handleReset={handleReset}
					isFull={isFull}
					onAddToCart={handleAddToCart}
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
			<div style={{ overflowY: "auto", width: "400px" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
