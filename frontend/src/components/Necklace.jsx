import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGesture } from "@use-gesture/react";
gsap.registerPlugin(MotionPathPlugin);

/**
 * Clamp a (tx, ty) translation so the zoomed content always fills the container.
 * At s ≤ 1 (overview), force (0, 0) — no translation needed.
 */
function clampTranslate(tx, ty, s, W, H) {
	if (s <= 1) return [0, 0];
	return [
		Math.max(W - W * s, Math.min(0, tx)),
		Math.max(H - H * s, Math.min(0, ty)),
	];
}

/**
 * Read the current GSAP numeric property safely (returns 0 / 1 fallbacks).
 */
function readGsap(el, prop, fallback) {
	return parseFloat(gsap.getProperty(el, prop)) || fallback;
}

function Necklace({ beads = [], length = 42, isMobile = false }) {
	// — Existing refs —
	const necklaceRef = useRef(null);
	const beadContainerRef = useRef(null);
	const prevBeadsRef = useRef([]);
	const groupRef = useRef(null);

	// — Zoom / gesture refs (mobile only; all no-ops on desktop) —
	const zoomRef = useRef(null);
	const zoomStateRef = useRef({ s: 1, tx: 0, ty: 0 });
	const userOverrideRef = useRef(false);
	const isMobileRef = useRef(isMobile);
	const pinchInitRef = useRef(null);
	const lastTapRef = useRef(0);

	// Keep isMobileRef in sync with the prop so gesture callbacks don't stale-close
	useEffect(() => {
		isMobileRef.current = isMobile;
	}, [isMobile]);

	// — Path / capacity constants —
	// Mobile beads are smaller so they look proportional against the rendered stroke.
	// The path arc scales with beadPixelWidth, so bead:arc ratio stays consistent.
	const beadPixelWidth = isMobile ? 7 : 15;
	const capacity = Math.floor((length / 10) * 35);
	const gapFactor = 0.65;
	const desiredPathLength = (capacity - 1) * beadPixelWidth * gapFactor;

	// — Scale the SVG group to match the desired arc length (unchanged) —
	useEffect(() => {
		if (!groupRef.current) return;
		const pathEl = groupRef.current.querySelector("#necklacePath");
		if (!pathEl) return;
		const baseLen = pathEl.getTotalLength();
		const scaleFactor = desiredPathLength / baseLen;
		gsap.set(groupRef.current, { scale: scaleFactor, transformOrigin: "50% 50%" });
	}, [length, desiredPathLength]);

	// — Initialise zoom wrapper origin on mount / mobile toggle —
	useEffect(() => {
		if (!zoomRef.current) return;
		if (isMobile) {
			gsap.set(zoomRef.current, { x: 0, y: 0, scale: 1, transformOrigin: "0 0" });
			zoomStateRef.current = { s: 1, tx: 0, ty: 0 };
			userOverrideRef.current = false;
		} else {
			// Reset to identity on desktop so the wrapper is a no-op
			gsap.set(zoomRef.current, { clearProps: "transform" });
			zoomStateRef.current = { s: 1, tx: 0, ty: 0 };
		}
	}, [isMobile]);

	// — Zoom out to full overview —
	const zoomOut = useCallback(() => {
		if (!zoomRef.current) return;
		zoomStateRef.current = { s: 1, tx: 0, ty: 0 };
		gsap.to(zoomRef.current, {
			duration: 0.5,
			ease: "power2.out",
			x: 0,
			y: 0,
			scale: 1,
			transformOrigin: "0 0",
		});
	}, []);

	/**
	 * Center the zoom viewport on `el` at 2.2× scale.
	 * Always resets userOverride so the next bead-add re-follows.
	 *
	 * Math: for a point at untransformed wrapper-relative position (ux, uy),
	 * its screen position is:
	 *   screenX = containerLeft + ux * s + tx
	 * Inverting: ux = (screenX − containerLeft − tx) / s
	 * Target state: (W/2, H/2) = ux * targetS + cTx  →  cTx = W/2 − ux * targetS
	 */
	const autoFollow = useCallback((el) => {
		if (!necklaceRef.current || !zoomRef.current || !el) return;
		userOverrideRef.current = false;

		const containerRect = necklaceRef.current.getBoundingClientRect();
		const beadRect = el.getBoundingClientRect();
		const bCx = beadRect.left + beadRect.width / 2;
		const bCy = beadRect.top + beadRect.height / 2;

		const { s, tx, ty } = zoomStateRef.current;
		const ux = (bCx - containerRect.left - tx) / s;
		const uy = (bCy - containerRect.top - ty) / s;

		const TARGET_SCALE = 2.2;
		const W = containerRect.width;
		const H = containerRect.height;
		const [cTx, cTy] = clampTranslate(
			W / 2 - ux * TARGET_SCALE,
			H / 2 - uy * TARGET_SCALE,
			TARGET_SCALE,
			W,
			H,
		);

		zoomStateRef.current = { s: TARGET_SCALE, tx: cTx, ty: cTy };
		gsap.to(zoomRef.current, {
			duration: 0.6,
			ease: "power2.out",
			x: cTx,
			y: cTy,
			scale: TARGET_SCALE,
			transformOrigin: "0 0",
		});
	}, []);

	// — Bead add / removal animations (extended for mobile zoom) —
	useEffect(() => {
		const container = beadContainerRef.current;
		if (!container) return;

		const oldBeads = prevBeadsRef.current;
		const newBeads = beads;
		const den = capacity > 1 ? capacity - 1 : 1;
		const tl = gsap.timeline();
		const mobile = isMobileRef.current;

		// — REMOVAL: fade removed bead, snap remaining to slots —
		if (oldBeads.length > newBeads.length) {
			const removedIndex = oldBeads.findIndex(
				(b) => !newBeads.some((n) => n.id === b.id),
			);
			if (removedIndex === -1) {
				prevBeadsRef.current = beads;
				return;
			}
			const removedId = oldBeads[removedIndex].id;
			const removedEl = container.querySelector(`[data-id="${removedId}"]`);
			if (removedEl) {
				tl.to(removedEl, { duration: 0.4, ease: "power1.inOut", opacity: 0, scale: 0 });
			}

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

			// Mobile: re-focus on last bead after fade (skip if user has overridden)
			if (mobile && zoomRef.current) {
				if (newBeads.length === 0) {
					tl.add(() => zoomOut(), "+=0.1");
				} else if (!userOverrideRef.current) {
					const lastEl = container.children[newBeads.length - 1];
					if (lastEl) tl.add(() => autoFollow(lastEl), "+=0.1");
				}
			}
		}

		// — ADDITION: drop + slide new bead —
		else if (newBeads.length > oldBeads.length) {
			const idx = newBeads.length - 1;
			const el = container.children[idx];
			if (el) {
				const targetOffset = 1 - idx / den;

				tl.set(el, { opacity: 0, scale: 0 });

				// Drop from above (mobile: snappier to match touch cadence)
				tl.to(el, {
					duration: mobile ? 0.55 : 0.8,
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

				// Slide onto necklace (mobile: snappier)
				tl.to(el, {
					duration: mobile ? 0.55 : 0.8,
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

				// Mobile: auto-follow the new bead (overrides any user pan — plan §B.4)
				if (mobile && zoomRef.current) {
					tl.add(() => autoFollow(el));
				}
			}
		}

		prevBeadsRef.current = beads;
	}, [beads, capacity, autoFollow, zoomOut]);

	// — Gesture bindings (active only when isMobile; desktop ref receives no-op) —
	useGesture(
		{
			onDragStart: () => {
				if (!isMobileRef.current) return;
				userOverrideRef.current = true;
				gsap.killTweensOf(zoomRef.current);
				// Sync zoomStateRef from GSAP in case we interrupted a tween mid-flight
				zoomStateRef.current = {
					s: readGsap(zoomRef.current, "scale", 1),
					tx: readGsap(zoomRef.current, "x", 0),
					ty: readGsap(zoomRef.current, "y", 0),
				};
			},
			onDrag: ({ delta: [dx, dy] }) => {
				if (!isMobileRef.current) return;
				const { s, tx, ty } = zoomStateRef.current;
				if (s <= 1) {
					// At overview zoom, single-finger drag scrolls the page
					window.scrollBy(0, -dy);
					return;
				}
				const cr = necklaceRef.current.getBoundingClientRect();
				const [cTx, cTy] = clampTranslate(tx + dx, ty + dy, s, cr.width, cr.height);
				zoomStateRef.current = { s, tx: cTx, ty: cTy };
				gsap.set(zoomRef.current, { x: cTx, y: cTy });
			},
			onPinchStart: ({ origin: [ox, oy] }) => {
				if (!isMobileRef.current) return;
				userOverrideRef.current = true;
				gsap.killTweensOf(zoomRef.current);
				const cr = necklaceRef.current?.getBoundingClientRect();
				const curS = readGsap(zoomRef.current, "scale", 1);
				const curTx = readGsap(zoomRef.current, "x", 0);
				const curTy = readGsap(zoomRef.current, "y", 0);
				zoomStateRef.current = { s: curS, tx: curTx, ty: curTy };
				// Cache everything needed so onPinch doesn't re-query the DOM on every frame
				pinchInitRef.current = {
					s: curS,
					tx: curTx,
					ty: curTy,
					// Pinch origin relative to container (stays constant through the gesture)
					ox: cr ? ox - cr.left : ox,
					oy: cr ? oy - cr.top : oy,
					W: cr?.width ?? 300,
					H: cr?.height ?? 200,
				};
			},
			onPinch: ({ offset: [gestureScale] }) => {
				if (!isMobileRef.current || !pinchInitRef.current) return;
				const { s: initS, tx: initTx, ty: initTy, ox, oy, W, H } = pinchInitRef.current;

				const newS = Math.max(0.8, Math.min(4, initS * gestureScale));

				// Keep the pinch origin fixed in the content: derive its untransformed position
				const ux = (ox - initTx) / initS;
				const uy = (oy - initTy) / initS;

				const [cTx, cTy] = clampTranslate(ox - ux * newS, oy - uy * newS, newS, W, H);
				zoomStateRef.current = { s: newS, tx: cTx, ty: cTy };
				gsap.set(zoomRef.current, {
					x: cTx,
					y: cTy,
					scale: newS,
					transformOrigin: "0 0",
				});
			},
		},
		{
			target: zoomRef,
			drag: {
				enabled: isMobile,
				filterTaps: true, // don't treat taps as drag starts
			},
			pinch: {
				enabled: isMobile,
			},
		},
	);

	/**
	 * Double-tap toggles between overview (s=1) and 2.2× zoom on the tapped point.
	 * Attached to the outer necklace container so it fires on single-tap misses too
	 * (beads are tiny and the tapped point matters, not just bead selection).
	 */
	const handleContainerClick = useCallback(
		(e) => {
			if (!isMobileRef.current) return;
			const now = Date.now();
			const elapsed = now - lastTapRef.current;
			lastTapRef.current = now;
			if (elapsed > 300) return; // not a double-tap

			e.preventDefault();
			const cr = necklaceRef.current.getBoundingClientRect();
			const { s, tx, ty } = zoomStateRef.current;

			if (s > 1.1) {
				zoomOut();
			} else {
				const tapX = e.clientX - cr.left;
				const tapY = e.clientY - cr.top;
				const TARGET_SCALE = 2.2;
				const ux = (tapX - tx) / s;
				const uy = (tapY - ty) / s;
				const [cTx, cTy] = clampTranslate(
					tapX - ux * TARGET_SCALE,
					tapY - uy * TARGET_SCALE,
					TARGET_SCALE,
					cr.width,
					cr.height,
				);
				zoomStateRef.current = { s: TARGET_SCALE, tx: cTx, ty: cTy };
				gsap.to(zoomRef.current, {
					duration: 0.4,
					ease: "power2.out",
					x: cTx,
					y: cTy,
					scale: TARGET_SCALE,
					transformOrigin: "0 0",
				});
			}
		},
		[zoomOut],
	);

	// — Render —
	return (
		<div
			ref={necklaceRef}
			className="Necklace position-relative"
			style={{
				// Mobile: fill the square white card in Builder; dimensions are
				// controlled by the container, not here.
				width: isMobile ? "100%" : "80%",
				height: isMobile ? "100%" : "80vh",
				minHeight: isMobile ? 0 : "400px",
				overflow: isMobile ? "hidden" : "visible",
				margin: "0 auto",
			}}
			onClick={handleContainerClick}
		>
			{/*
			 * Zoom wrapper — on mobile all transform (translate + scale) is applied here
			 * so both the SVG path and the bead image overlay scale together.
			 * On desktop scale = 1, translate = 0,0: completely transparent no-op.
			 */}
			<div
				ref={zoomRef}
				style={{
					width: "100%",
					height: "100%",
					// Prevent browser scroll/zoom inside the necklace area on mobile;
					// drag handler falls back to window.scrollBy at s=1.
					touchAction: isMobile ? "none" : "auto",
					willChange: isMobile ? "transform" : "auto",
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
							stroke="rgb(84,84,84)"
							strokeWidth="2.5"
							vectorEffect="non-scaling-stroke"
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
		</div>
	);
}

export default Necklace;
