import { useState } from "react";
import BeadJar from "./BeadJar";

const BeadSelection = () => {
    const [selectedBeads, setSelectedBeads] = useState([]);
    const beadsToLoad = ["amber", "amethyst"]; // String array of bead types

    const handleBeadSelect = (beadColor) => {
        console.log("Bead selected:", beadColor);
        setSelectedBeads([...selectedBeads, beadColor]);
    };

    return (
        <div className="bead-selection-container">
            <h2>Select Beads</h2>

            <div className="bead-jars">
                {beadsToLoad.map((bead) => (
                    <BeadJar
                        key={bead}
                        jarImage={`/images/${bead}/jar.png`}
                        beadImage={`/images/${bead}/bead.png`}
                        beadColor={bead}
                        onClick={handleBeadSelect}
                    />
                ))}
            </div>

            <div className="selected-beads">
                <p>Selected beads: {selectedBeads.join(", ")}</p>
            </div>
        </div>
    );
};

export default BeadSelection;
