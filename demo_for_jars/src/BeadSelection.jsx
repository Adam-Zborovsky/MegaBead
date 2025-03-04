import React, { useState } from "react";
import BeadJar from "./BeadJar";
import jarImage from "./images/amber/amber_jar.png";
import lidImage from "./images/Lid.png";
import beadImage from "./images/amber/amber_bead.png";
import floatingLid from "./images/Floating_Lid.png";

const BeadSelection = () => {
	const [selectedBeads, setSelectedBeads] = useState([]);

	// For debugging - log when beads are selected
	const handleBeadSelect = (beadColor) => {
		console.log("Bead selected:", beadColor);
		setSelectedBeads([...selectedBeads, beadColor]);
	};

	return (
		<div className="bead-selection-container">
			<h2>Select Beads</h2>

			<div className="bead-jars">
				<BeadJar
					jarImage={jarImage}
					lidImage={lidImage}
					floatingLid={floatingLid}
					beadImage={beadImage}
					beadColor="amber"
					onClick={handleBeadSelect}
				/>
			</div>

			<div className="selected-beads">
				<p>Selected beads: {selectedBeads.join(", ")}</p>
			</div>
		</div>
	);
};

export default BeadSelection;
