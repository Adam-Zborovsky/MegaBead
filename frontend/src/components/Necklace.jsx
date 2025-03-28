import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const Necklace = ({ beads = [], length = 42 }) => {
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);
	const prevBeadsRef = useRef(null);
	const scaleFactor = length / 42;

	useEffect(() => {
		if (beads.length && beadContainerRef.current && necklaceRef.current) {
			const newBead = beadContainerRef.current.lastElementChild;
			if (newBead) {
				const tl = gsap.timeline();

				// -- 1) Measure the necklace path length in "user coordinates" --
				const pathEl = necklaceRef.current.querySelector("#necklacePath");
				// getTotalLength() returns the length of the path in the SVG’s coordinate system
				const pathLength = pathEl.getTotalLength();

				// -- 2) Convert your bead’s pixel width into SVG user coordinates --
				// measure how large the SVG is currently rendered (in px),
				// compute the scale factor relative to the viewBox.
				const svg = necklaceRef.current.querySelector("svg");
				const svgRect = svg.getBoundingClientRect();
				const scaleX = svgRect.width / 1000;

				// Convert bead width from pixels to SVG user units.
				const beadPixelWidth = 20;
				const beadWidthInUserUnits = beadPixelWidth / scaleX;

				// Calculate how much of the path each bead occupies.
				const offsetPerBead = beadWidthInUserUnits / pathLength;
				const effectiveOffsetPerBead = offsetPerBead * 0.9;

				const beadIndex = beads.length - 1;
				let targetOffset = 1 - beadIndex * effectiveOffsetPerBead;
				if (targetOffset < 0) {
					targetOffset = 0;
				}

				// -- 4) Animate: Phase 1 (dropPath) then Phase 2 (necklacePath) --

				// Start invisible and scaled down
				tl.set(newBead, { opacity: 0, scale: 0 });

				// Drop from offscreen along the invisible drop path
				tl.to(newBead, {
					duration: 0.5,
					ease: "power1.inOut",
					opacity: 1,
					scale: 1,
					motionPath: {
						path: "#dropPath",
						align: "#dropPath",
						autoRotate: true,
						alignOrigin: [0.5, 0.5],
						start: 0,
						end: 1,
					},
				});

				// Slide along the visible necklace path to targetOffset
				tl.to(newBead, {
					duration: 2,
					ease: "power1.inOut",
					motionPath: {
						path: "#necklacePath",
						align: "#necklacePath",
						autoRotate: true,
						alignOrigin: [0.5, 0.5],
						start: 0,
						end: targetOffset,
					},
				});
			}
		} // If a bead was removed
		if (prevBeadsRef.current.length > beads.length) {
			// Determine the index that was removed:
			// We'll assume the removed bead is the one missing in the new array
			let removedIndex = -1;
			for (let i = 0; i < prevBeadsRef.current.length; i++) {
				if (!beads.find((b) => b.id === prevBeadsRef.current[i].id)) {
					removedIndex = i;
					break;
				}
			}
			if (removedIndex !== -1 && beadContainerRef.current) {
				const beadElements = beadContainerRef.current.children;
				const removedEl = beadElements[removedIndex];
				// Animate the removed bead toward the middle of the U and fade out
				gsap.to(removedEl, {
					duration: 1,
					x: 0, // adjust as needed for the U's center
					y: 50, // move downward; adjust for your U shape
					opacity: 0,
					ease: "power2.inOut",
					onComplete: () => {
						// After removal animation, animate remaining beads to shift
						// We'll animate beads with index > removedIndex to move down by 20px
						for (let j = removedIndex; j < beadElements.length; j++) {
							gsap.to(beadElements[j], {
								duration: 0.5,
								y: "+=20",
								ease: "power2.inOut",
							});
						}
					},
				});
			}
		}
		prevBeadsRef.current = beads;
	}, [beads]);

	return (
		<div
			ref={necklaceRef}
			className="position-relative"
			style={{
				width: "80%",
				height: "80vh",
				minHeight: "400px",
				overflow: "visible",
			}}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 1000 600"
				preserveAspectRatio="xMidYMid meet"
			>
				<g transform={`scale(${scaleFactor})`} transformOrigin="50% 50%">
					<path
						id="necklacePath"
						d="M800,0 C800,800 100,800 100,0"
						stroke="rgb(84,84,84)"
						strokeWidth="1.5"
						fill="none"
					/>
				</g>
			</svg>

			<div
				ref={beadContainerRef}
				className="position-absolute top-0 start-0"
				style={{ width: "100%", height: "100%" }}
			>
				{beads.map((bead, index) => (
					<img
						key={index}
						src={bead.image}
						alt={bead.name}
						className="position-absolute"
						style={{ width: "20px", height: "20px" }}
					/>
				))}
			</div>
		</div>
	);
};

export default Necklace;
