// BeadSelection.jsx
import { useState, useEffect } from "react";
import BeadJar from "./BeadJar";

const BeadSelection = ({ onBeadSelect }) => {
	const [beadsToLoad, setBeadsToLoad] = useState([]);

	useEffect(() => {
		// This would normally be an API call or dynamic import
		// For now, we'll hardcode the folder structure we discovered
		const beadTypes = [
			{ name: "amber", multiBeads: false },
			{ name: "amethyst", multiBeads: false },
			{ name: "aqua", multiBeads: false },
			{ name: "aventurine", multiBeads: false },
			{ name: "blue_veined", multiBeads: false },
			{ name: "blueberry", multiBeads: false },
			{ name: "champagne_quartz", multiBeads: false },
			{ name: "charcoal", multiBeads: false },
			{ name: "copper", multiBeads: false },
			{ name: "crystal", multiBeads: false },
			{ name: "dark_blue", multiBeads: false },
			{
				name: "earth",
				multiBeads: true,
				variants: ["earth_brown", "earth_gold", "earth_white"],
			},
			{ name: "forest", multiBeads: false },
			{ name: "garnet", multiBeads: false },
			{ name: "gray", multiBeads: false },
			{ name: "honey", multiBeads: false },
			{ name: "jade", multiBeads: false },
			{ name: "malachite", multiBeads: false },
			{ name: "midnight", multiBeads: false },
			{ name: "moss", multiBeads: false },
			{ name: "onyx", multiBeads: false },
			{ name: "opal", multiBeads: false },
			{ name: "orange_coral", multiBeads: false },
			{
				name: "pebble",
				multiBeads: true,
				variants: ["pebble_orange", "pebble_white", "pebble_wood"],
			},
			{ name: "pink_quartz", multiBeads: false },
			{
				name: "rainbow",
				multiBeads: true,
				variants: [
					"rainbow_blue",
					"rainbow_green",
					"rainbow_red",
					"rainbow_yellow",
				],
			},
			{ name: "red_coral", multiBeads: false },
			{
				name: "rose",
				multiBeads: true,
				variants: ["rose_green", "rose_purple", "rose_teal"],
			},
			{ name: "ruby", multiBeads: false },
			{ name: "sand", multiBeads: false },
			{ name: "sapphire", multiBeads: false },
			{ name: "stone", multiBeads: false },
			{ name: "storm", multiBeads: false },
			{ name: "sunshine", multiBeads: false },
			{ name: "teal", multiBeads: false },
			{ name: "turquoise", multiBeads: false },
		];

		setBeadsToLoad(beadTypes);
	}, []);

	// We simply pass along the data from BeadJar to the parent
	const handleBeadSelect = (beadData) => {
		console.log("Bead selected:", beadData);
		onBeadSelect(beadData);
	};

	return (
		<div className="container">
			{/* 
        1) Reduce the gutter from g-2 to g-1 or g-0 for tighter spacing
        2) Change col-4 to col-3 or col-2 if you want them even closer
      */}
			<div className="row g-2 justify-content-center">
				{beadsToLoad.map((bead) => (
					<div key={bead.name} className="col-4">
						<BeadJar
							jarImage={`../images/${bead.name}/jar.png`}
							beadImage={
								bead.multiBeads
									? `../images/${bead.name}/${bead.variants[0]}_bead.png`
									: `../images/${bead.name}/bead.png`
							}
							beadColor={bead.name}
							isMultiBead={bead.multiBeads}
							beadVariants={
								bead.multiBeads
									? bead.variants.map(
											(v) => `../images/${bead.name}/${v}_bead.png`
									  )
									: []
							}
							onClick={handleBeadSelect}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default BeadSelection;
