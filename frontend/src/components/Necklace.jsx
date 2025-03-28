import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const Necklace = ({ beads }) => {
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);

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
		}
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
				{/* Invisible drop path*/}
				<path id="dropPath" d="M800,-350 L800,0" fill="none" stroke="none" />

				{/* Visible necklace path */}
				<path
					id="necklacePath"
					d="M800,0 C800,800 100,800 100,0"
					fill="none"
					stroke="rgb(84,84,84)"
					strokeWidth="1.5"
				/>
			</svg>

			<div
				ref={beadContainerRef}
				className="position-absolute top-0 start-0"
				style={{
					width: "100%",
					height: "100%",
				}}
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
