import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import lidImage from "./images/Lid.png";
import floatingLid from "./images/Floating_Lid.png";
import "./BeadJar.css";

const BeadJar = ({
	jarImage,
	beadImage,
	beadColor,
	onClick,
	isMultiBead,
	beadVariants,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [currentBeadIndex, setCurrentBeadIndex] = useState(0);
	const containerRef = useRef(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const intervalRef = useRef(null);

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

	useEffect(() => {
		if (isMultiBead && beadVariants && beadVariants.length > 1 && isHovered) {
			intervalRef.current = setInterval(() => {
				setCurrentBeadIndex((prevIndex) =>
					prevIndex === beadVariants.length - 1 ? 0 : prevIndex + 1
				);
			}, 1500); // Change bead every second

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					setCurrentBeadIndex(0);
				}
			};
		}
	}, [isHovered, isMultiBead, beadVariants]);

	const getBeadAnimation = () => {
		const animationDistance = containerHeight * 0.4;

		return {
			opacity: isHovered ? 1 : 0,
			y: isHovered ? -animationDistance : 0,
			transition: {
				duration: 0.4,
				delay: isHovered ? 0.2 : 0,
			},
		};
	};

	const getCurrentBeadImage = () => {
		if (isMultiBead && beadVariants && beadVariants.length > 0) {
			return beadVariants[currentBeadIndex];
		}
		return beadImage;
	};

	return (
		<div
			ref={containerRef}
			className="bead-jar-container"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => onClick && onClick(beadColor)}
		>
			<div className="debug-border">
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
					{!isHovered ? (
						<motion.img
							key="closed-lid"
							src={lidImage}
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
								transition: { duration: 0.3 },
							}}
						/>
					) : (
						<motion.img
							key="floating-lid"
							src={floatingLid}
							alt="Floating jar lid"
							className="floating-lid-image"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								transition: { duration: 0.3 },
							}}
						/>
					)}
				</AnimatePresence>
			</div>

			<div className="debug-info">
				Hovered: {isHovered ? "Yes" : "No"}
				{isMultiBead &&
					` | Bead: ${currentBeadIndex + 1}/${beadVariants.length}`}
			</div>
		</div>
	);
};

export default BeadJar;
