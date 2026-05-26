import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useIsMobile } from "../hooks/useIsMobile";
import "../style/BeadJar.css";

const BeadJar = ({
	jarImage,
	beadImage,
	beadColor,
	onClick,
	isMultiBead,
	beadVariants,
	// Mobile-only props (no-ops on desktop)
	isActive = false,
	onActivate = () => {},
	isFull = false,
}) => {
	const isMobile = useIsMobile();
	const [isHovered, setIsHovered] = useState(false);
	const [currentBeadIndex, setCurrentBeadIndex] = useState(0);
	const [isShaking, setIsShaking] = useState(false);
	const containerRef = useRef(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const intervalRef = useRef(null);
	const shakeTimeoutRef = useRef(null);

	// Pointer-movement tracking — distinguishes tap from scroll on touch devices
	const pointerStartPos = useRef(null);
	const pointerMoved = useRef(false);

	// Visual open state: hover-driven on desktop, active-prop-driven on mobile
	const isOpen = isMobile ? isActive : isHovered;

	// — Container height measurement (for bead-rise distance) —
	useEffect(() => {
		if (containerRef.current) {
			const updateHeight = () => {
				setContainerHeight(containerRef.current.clientHeight);
			};
			updateHeight();
			window.addEventListener("resize", updateHeight);
			return () => window.removeEventListener("resize", updateHeight);
		}
	}, []);

	// — Cleanup shake timeout on unmount —
	useEffect(() => {
		return () => {
			if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
		};
	}, []);

	// — Desktop: cycle multi-bead variants on a timer while hovered —
	useEffect(() => {
		if (isMultiBead && beadVariants && beadVariants.length > 1 && isHovered) {
			intervalRef.current = setInterval(() => {
				setCurrentBeadIndex((prevIndex) =>
					prevIndex === beadVariants.length - 1 ? 0 : prevIndex + 1
				);
			}, 1500);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					setCurrentBeadIndex(0);
				}
			};
		}
	}, [isHovered, isMultiBead, beadVariants]);

	// — Mobile: reset variant index when another jar takes focus —
	useEffect(() => {
		if (isMobile && !isActive) {
			setCurrentBeadIndex(0);
		}
	}, [isActive, isMobile]);

	const getCurrentBeadImage = () => {
		if (isMultiBead && beadVariants && beadVariants.length > 0) {
			return beadVariants[currentBeadIndex];
		}
		return beadImage;
	};

	const getBeadAnimation = () => {
		const animationDistance = containerHeight * 0.4;
		return {
			opacity: isOpen ? 1 : 0,
			y: isOpen ? -animationDistance : 0,
			transition: {
				// Mobile: snappier rise with no delay (touch cadence is faster)
				duration: isMobile ? 0.25 : 0.4,
				delay: isOpen && !isMobile ? 0.2 : 0,
			},
		};
	};

	// — Shake feedback (mobile: necklace-is-full rejection) —
	const triggerShake = () => {
		setIsShaking(true);
		if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
		shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 380);
	};

	// — Pointer tracking helpers —
	const handlePointerDown = (e) => {
		pointerStartPos.current = { x: e.clientX, y: e.clientY };
		pointerMoved.current = false;
	};

	const handlePointerMove = (e) => {
		if (!pointerStartPos.current) return;
		const dx = Math.abs(e.clientX - pointerStartPos.current.x);
		const dy = Math.abs(e.clientY - pointerStartPos.current.y);
		if (dx > 8 || dy > 8) pointerMoved.current = true;
	};

	// — Unified click/tap handler —
	const handleContainerClick = () => {
		// Swallow events caused by scroll gestures on mobile
		if (isMobile && pointerMoved.current) return;

		if (isMobile) {
			if (!isActive) {
				// First tap: open the jar (or warn if necklace already full)
				if (isFull) {
					triggerShake();
					toast.warn("Necklace is full — reset or add to cart first.");
					return;
				}
				onActivate();
				return;
			}

			// Subsequent taps: add the currently-displayed variant
			if (isFull) {
				triggerShake();
				toast.warn("Necklace is full!");
				return;
			}

			const chosenImage =
				isMultiBead && beadVariants && beadVariants.length > 0
					? beadVariants[currentBeadIndex]
					: beadImage;

			// Advance variant index so the next tap shows the next variant
			if (isMultiBead && beadVariants && beadVariants.length > 1) {
				setCurrentBeadIndex((prev) =>
					prev === beadVariants.length - 1 ? 0 : prev + 1
				);
			}

			if (onClick) onClick({ name: beadColor, image: chosenImage });
			return;
		}

		// Desktop: original random-variant behavior
		let chosenImage;
		if (isMultiBead && beadVariants && beadVariants.length > 0) {
			const randomIndex = Math.floor(Math.random() * beadVariants.length);
			chosenImage = beadVariants[randomIndex];
		} else {
			chosenImage = beadImage;
		}
		if (onClick) onClick({ name: beadColor, image: chosenImage });
	};

	return (
		<div
			ref={containerRef}
			className={`bead-jar-container${isMobile && isActive ? " is-active" : ""}${isShaking ? " is-shaking" : ""}`}
			onMouseEnter={() => !isMobile && setIsHovered(true)}
			onMouseLeave={() => !isMobile && setIsHovered(false)}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onClick={handleContainerClick}
		>
			<div className="bead-jar-layout">
				<motion.img
					src={getCurrentBeadImage()}
					alt={`${beadColor} bead`}
					className="bead-image"
					initial={{ opacity: 0, y: 0 }}
					animate={getBeadAnimation()}
				/>

				<img
					src={jarImage}
					alt={`Jar of ${beadColor} beads`}
					className="jar-image"
				/>

				<AnimatePresence mode="wait">
					{!isOpen ? (
						<motion.img
							key="closed-lid"
							src={"/images/Lid.png"}
							alt="Jar lid"
							className="lid-image"
							initial={{
								x: -10,
								y: -containerHeight * 0.3,
								rotate: -15,
								opacity: 0,
							}}
							animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
							exit={{
								x: -10,
								y: -containerHeight * 0.3,
								rotate: -15,
								opacity: 0,
								transition: { duration: isMobile ? 0.2 : 0.3 },
							}}
						/>
					) : (
						<motion.img
							key="floating-lid"
							src={"/images/Floating_Lid.png"}
							alt="Floating jar lid"
							className="floating-lid-image"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								transition: { duration: isMobile ? 0.2 : 0.3 },
							}}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default BeadJar;
