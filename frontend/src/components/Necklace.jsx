import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const Necklace = ({ beads = [], length = 42 }) => {
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);
	const prevBeadsRef = useRef([]);
	const groupRef = useRef(null);

	const beadPixelWidth = 15;
	const capacity = Math.floor((length / 10) * 35);

	// We define a gapFactor < 1 to reduce spacing
	const gapFactor = 0.65; // adjust to 0.9, 0.7, etc. until it looks right

	// Instead of capacity * beadPixelWidth, we multiply by gapFactor
	// and use (capacity - 1) because the offset from 1→0 is split into (capacity-1) intervals
	const desiredPathLength = (capacity - 1) * beadPixelWidth * gapFactor;

	// Scale the base path so its arc length ~ desiredPathLength
	useEffect(() => {
		if (groupRef.current) {
			const pathEl = groupRef.current.querySelector("#necklacePath");
			if (pathEl) {
				const baseLength = pathEl.getTotalLength();
				const scaleFactor = desiredPathLength / baseLength;
				gsap.set(groupRef.current, {
					scale: scaleFactor,
					transformOrigin: "50% 50%",
				});
			}
		}
	}, [length, desiredPathLength]);

	// Animate new beads
	useEffect(() => {
		if (beads.length && beadContainerRef.current && necklaceRef.current) {
			const newBead = beadContainerRef.current.lastElementChild;
			if (newBead) {
				const tl = gsap.timeline();

				// 1) Drop from the drop path
				tl.set(newBead, { opacity: 0, scale: 0 });
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

				// 2) Slide along the necklace path
				const i = beads.length - 1;
				if (capacity > 1) {
					let offsetFrac = 1 - i / (capacity - 1);
					if (offsetFrac < 0) offsetFrac = 0;
					if (offsetFrac > 1) offsetFrac = 1;

					tl.to(newBead, {
						duration: 2,
						ease: "power1.inOut",
						motionPath: {
							path: "#necklacePath",
							align: "#necklacePath",
							autoRotate: true,
							alignOrigin: [0.5, 0.5],
							start: 0,
							end: offsetFrac,
						},
					});
				}
			}
		}

		// Removal animation if needed
		if (prevBeadsRef.current.length > beads.length) {
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
				gsap.to(removedEl, {
					duration: 1,
					x: 0,
					y: 50,
					opacity: 0,
					ease: "power2.inOut",
					onComplete: () => {
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
	}, [beads, capacity]);

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
				<g ref={groupRef}>
					<path
						id="dropPath"
						d="M450,-350 L600,-25"
						fill="none"
						stroke="none"
					/>
					<path
						id="necklacePath"
						d="M600,-25 C1000,600 0,600 400,-25"
						stroke="rgb(84,84,84)"
						strokeWidth="2"
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
						style={{
							width: `${beadPixelWidth}px`,
							height: `${beadPixelWidth}px`,
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default Necklace;
