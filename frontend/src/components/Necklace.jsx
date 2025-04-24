import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

function Necklace({ beads = [], length = 42 }) {
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);
	const prevBeadsRef = useRef([]);
	const groupRef = useRef(null);

	// Parameters
	const beadPixelWidth = 15;
	const capacity = Math.floor((length / 10) * 35);
	const gapFactor = 0.65;
	const desiredPathLength = (capacity - 1) * beadPixelWidth * gapFactor;

	// 1) scale the SVG path
	useEffect(() => {
		if (!groupRef.current) return;
		const pathEl = groupRef.current.querySelector("#necklacePath");
		if (!pathEl) return;
		const baseLen = pathEl.getTotalLength();
		const scaleFactor = desiredPathLength / baseLen;
		gsap.set(groupRef.current, {
			scale: scaleFactor,
			transformOrigin: "50% 50%",
		});
	}, [length, desiredPathLength]);

	// 2) animate add & removal
	useEffect(() => {
		// — REMOVAL branch —
		const container = beadContainerRef.current;
		if (!container) return;

		const oldBeads = prevBeadsRef.current;
		const newBeads = beads;
		const den = capacity > 1 ? capacity - 1 : 1;
		const tl = gsap.timeline();

		if (oldBeads.length > newBeads.length) {
			// 1) identify removed bead
			const removedIndex = oldBeads.findIndex(
				(b) => !newBeads.some((n) => n.id === b.id)
			);
			// — slide every bead after the hole forward by exactly one slot —
			newBeads.forEach((_, idx) => {
				if (idx >= removedIndex) {
					const el = container.children[idx];
					const oldOff = 1 - idx / den;
					const newOff = 1 - (idx - 1) / den;

					tl.to(
						el,
						{
							duration: 0.4,
							ease: "power2.inOut",
							motionPath: {
								path: "#necklacePath",
								align: "#necklacePath",
								autoRotate: true,
								alignOrigin: [0.5, 0.5],
								start: oldOff,
								end: newOff,
							},
						},
						0
					);
				}
			});
		}

		// — ADDITION branch —
		else if (newBeads.length > oldBeads.length) {
			// animate only the last bead
			const lastIdx = newBeads.length - 1;
			const el = container.children[lastIdx];
			if (el) {
				const startOff = 1 - lastIdx / den;
				tl.set(el, { opacity: 0, scale: 0 });
				tl.to(el, {
					duration: 1,
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
				// then slide it onto necklace
				tl.to(el, {
					duration: 1,
					ease: "power1.inOut",
					motionPath: {
						path: "#necklacePath",
						align: "#necklacePath",
						autoRotate: true,
						alignOrigin: [0.5, 0.5],
						start: 0,
						end: startOff,
					},
				});
			}
		}

		// sync for next diff
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
						d="M800,-350 L800,-25"
						fill="none"
						stroke="none"
					/>
					<path
						id="necklacePath"
						d="M800,-25 C800,800 100,800 100,-25"
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
				{beads.map((bead, idx) => (
					<img
						key={bead.id}
						data-id={bead.id}
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
}

export default Necklace;
