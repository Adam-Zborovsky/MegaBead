import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

function Necklace({ beads = [], length = 42 }) {
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);
	const prevBeadsRef = useRef([]);
	const groupRef = useRef(null);

	const beadPixelWidth = 15;
	const capacity = Math.floor((length / 10) * 35);
	const gapFactor = 0.65;
	const desiredPathLength = (capacity - 1) * beadPixelWidth * gapFactor;

	//Scale the SVG path to match desired arc length
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

	//  Removal snapping + Add drop-in
	useEffect(() => {
		const container = beadContainerRef.current;
		if (!container) return;

		const oldBeads = prevBeadsRef.current;
		const newBeads = beads;
		const den = capacity > 1 ? capacity - 1 : 1;
		const tl = gsap.timeline();

		// — REMOVAL: fade removed bead, then snap all remaining to exact slots —
		if (oldBeads.length > newBeads.length) {
			// a) find & fade out the removed bead
			const removedIndex = oldBeads.findIndex(
				(b) => !newBeads.some((n) => n.id === b.id)
			);
			const removedId = oldBeads[removedIndex].id;
			const removedEl = container.querySelector(`[data-id="${removedId}"]`);
			if (removedEl) {
				tl.to(removedEl, {
					duration: 0.4,
					ease: "power1.inOut",
					opacity: 0,
					scale: 0,
				});
			}

			// b) snap every bead into its capacity-based slot
			newBeads.forEach((_, idx) => {
				const el = container.children[idx];
				const offset = 1 - idx / den;
				gsap.set(el, {
					motionPath: {
						path: "#necklacePath",
						align: "#necklacePath",
						autoRotate: true,
						alignOrigin: [0.5, 0.5],
						start: 0,
						end: offset,
					},
				});
			});
		}

		// — ADDITION: drop + slide new bead into its capacity-based slot —
		else if (newBeads.length > oldBeads.length) {
			const idx = newBeads.length - 1;
			const el = container.children[idx];
			if (el) {
				const targetOffset = 1 - idx / den;

				tl.set(el, { opacity: 0, scale: 0 });

				// drop from above
				tl.to(el, {
					duration: 0.8,
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

				// slide onto the necklace
				tl.to(el, {
					duration: 0.8,
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

		//  sync for next diff
		prevBeadsRef.current = beads;
	}, [beads, capacity]);

	//  Render
	return (
		<div
			ref={necklaceRef}
			className="Necklace position-relative"
			style={{
				width: "80%",
				height: "80vh",
				minHeight: "400px",
				overflow: "visible",
				margin: "0 auto",
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
						d="M800,-350 L850,-25"
						fill="none"
						stroke="none"
					/>
					<path
						id="necklacePath"
						d="M850,-25 C850,850 150, 850 150,-25"
						//M500,300 C800,800 100,800 400,300
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
				{beads.map((bead) => (
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
