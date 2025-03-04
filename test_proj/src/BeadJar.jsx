import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BeadJar.css";

const BeadJar = ({
	jarImage, // The open jar image
	lidImage, // The regular lid that fits on top
	floatingLid, // The floating lid image
	beadImage, // The bead image
	beadColor,
	onClick,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	// For debugging - log state changes
	useEffect(() => {
		console.log("Hover state changed:", isHovered);
	}, [isHovered]);

	return (
		<div
			className="bead-jar-container"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => onClick && onClick(beadColor)}
		>
			<div className="debug-border">
				{/* Bead positioned inside the jar */}
				<motion.img
					src={beadImage}
					alt={`${beadColor} bead`}
					className="bead-image"
					initial={{ opacity: 0, y: 0 }}
					animate={{
						opacity: isHovered ? 1 : 0,
						y: isHovered ? -60 : 0,
						transition: {
							delay: isHovered ? 0.2 : 0,
							duration: 0.4,
						},
					}}
				/>

				{/* Base jar image */}
				<img
					src={jarImage}
					alt={`Jar of ${beadColor} beads`}
					className="jar-image"
				/>

				{/* AnimatePresence to handle entering/exiting animations */}
				<AnimatePresence>
					{!isHovered ? (
						<motion.img
							key="closed-lid"
							src={lidImage}
							alt="Jar lid"
							className="lid-image"
							initial={{ x: 0, y: 0, rotate: 0 }}
							exit={{
								x: -20,
								y: -25,
								rotate: -25,
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
							initial={{ opacity: 1 }}
						/>
					)}
				</AnimatePresence>
			</div>

			{/* Display hover state for debugging */}
			<div className="debug-info">Hovered: {isHovered ? "Yes" : "No"}</div>
		</div>
	);
};

export default BeadJar;
