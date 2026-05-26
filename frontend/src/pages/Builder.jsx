import { useState, useEffect, useContext } from "react";
import BeadSelection from "../components/BeadSelection";
import Necklace from "../components/Necklace";
import BeadList from "../components/BeadList";
import LengthOptions from "../components/LengthOptions";
import MobileBeadListSheet from "../components/MobileBeadListSheet";
import { CartContext } from "../context/CartContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useIsMobile } from "../hooks/useIsMobile";

function Builder() {
	useDocumentTitle("Builder");
	const isMobile = useIsMobile();
	const [necklaceBeads, setNecklaceBeads] = useState([]);
	const [isFull, setIsFull] = useState(false);
	const [necklaceLength, setNecklaceLength] = useState(42);
	const [activeJarId, setActiveJarId] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const { addCustomItemToCart } = useContext(CartContext);
	const maxCapacity = Math.floor((necklaceLength / 10) * 35);

	const addBeadToNecklace = (bead) => {
		const uniqueBead = { ...bead, id: Date.now() + Math.random() };
		if (necklaceBeads.length < maxCapacity) {
			setNecklaceBeads((prev) => [...prev, uniqueBead]);
		} else {
			setIsFull(true);
		}
	};

	const removeBeadFromNecklace = (removeIndex) => {
		setNecklaceBeads((prev) => {
			const newArr = [...prev];
			newArr.splice(removeIndex, 1);
			return newArr;
		});
		setIsFull(false);
	};

	const handleAddToCart = async () => {
		const beadCounts = necklaceBeads.reduce((acc, bead) => {
			acc[bead.name] = (acc[bead.name] || 0) + 1;
			return acc;
		}, {});
		const description = Object.entries(beadCounts)
			.map(([name, count]) => `${name}: ${count}`)
			.join("\n");

		const productData = {
			name: `Custom ${necklaceLength > 25 ? "necklace" : "bracelet"}`,
			price: `${necklaceLength * 1.5} ₪`,
			type: necklaceLength > 25 ? "necklace" : "bracelet",
			description,
		};

		addCustomItemToCart(productData, 1);
	};

	const handleReset = () => {
		setNecklaceBeads([]);
		setIsFull(false);
		setActiveJarId(null);
	};

	const handleJarActivate = (beadName) => {
		setActiveJarId(beadName); // null closes all jars
	};

	// Reset beads when length changes (existing behavior)
	useEffect(() => {
		setNecklaceBeads([]);
	}, [necklaceLength]);

	// Clear active jar when resizing to desktop
	useEffect(() => {
		if (!isMobile) setActiveJarId(null);
	}, [isMobile]);

	// — Mobile layout —
	if (isMobile) {
		return (
			<div style={{ minHeight: "100vh", position: "relative" }}>
				{/* Sticky necklace preview */}
				{/*
				 * Full-width sticky row: uses the page background (bone) so content
				 * scrolling underneath is masked. The white necklace window is a
				 * square card centered inside it — not the whole bar.
				 */}
				<div
					style={{
						position: "sticky",
						top: "65px",
						zIndex: 10,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: "6px 0",
						// Match the navbar exactly: bone at 90% opacity + backdrop blur
						background: "rgba(250, 248, 244, 0.9)",
						backdropFilter: "blur(4px)",
						WebkitBackdropFilter: "blur(4px)",
						borderBottom: "1px solid #e8e2d9",
					}}
				>
					{/* Necklace preview card — wide but with side breathing room */}
					<div
						style={{
							width: "90vw",
							height: "38vh",
							background: "white",
							borderRadius: "10px",
							overflow: "hidden",
							boxShadow: "0 1px 6px rgba(26,22,18,0.07)",
						}}
					>
						<Necklace beads={necklaceBeads} length={necklaceLength} isMobile />
					</div>
				</div>

				{/* Scrollable content */}
				<div style={{ paddingBottom: "5rem" }}>
					{/* Length / type options */}
					<div className="d-flex justify-content-center py-1 px-4">
						<LengthOptions
							length={necklaceLength}
							onLengthChange={setNecklaceLength}
							rootClassName="w-100"
						/>
					</div>

					{/* Persistent interaction hint */}
					<p className="text-center text-muted small mb-1 px-3">
						Tap a jar to open · tap again to add
					</p>

					{/* Bead jar grid */}
					<BeadSelection
						onBeadSelect={addBeadToNecklace}
						activeJarId={activeJarId}
						onJarActivate={handleJarActivate}
						isFull={isFull}
					/>
				</div>

				{/* Floating Bead List pill */}
				<button
					className="btn btn-primary rounded-pill shadow"
					onClick={() => setSheetOpen(true)}
					style={{
						position: "fixed",
						bottom: "1.5rem",
						right: "1.5rem",
						zIndex: 100,
						padding: "0.6rem 1.2rem",
						fontSize: "0.875rem",
						fontWeight: 600,
					}}
				>
					Bead List · {necklaceBeads.length}
					{isFull && (
						<span
							className="ms-2 badge bg-success"
							style={{ fontSize: "0.7rem" }}
						>
							Full
						</span>
					)}
				</button>

				{/* Bottom sheet */}
				<MobileBeadListSheet
					isOpen={sheetOpen}
					onClose={() => setSheetOpen(false)}
					beads={necklaceBeads}
					onRemoveBead={removeBeadFromNecklace}
					handleReset={handleReset}
					isFull={isFull}
					onAddToCart={handleAddToCart}
				/>
			</div>
		);
	}

	// — Desktop layout — unchanged from original —
	return (
		<div className="d-flex justify-content-center" style={{ height: "100vh" }}>
			{/* Left: Bead List */}
			<div style={{ width: "400px", marginLeft: "75px" }}>
				<BeadList
					beads={necklaceBeads}
					onRemoveBead={removeBeadFromNecklace}
					handleReset={handleReset}
					isFull={isFull}
					onAddToCart={handleAddToCart}
				/>
			</div>

			{/* Center: Necklace & length card */}
			<div className=" d-flex flex-column justify-content-start align-items-center">
				<Necklace beads={necklaceBeads} length={necklaceLength} />
				<LengthOptions
					length={necklaceLength}
					onLengthChange={setNecklaceLength}
				/>
			</div>

			{/* Right: Bead Selection */}
			<div style={{ overflowY: "auto", width: "400px" }}>
				<BeadSelection onBeadSelect={addBeadToNecklace} />
			</div>
		</div>
	);
}

export default Builder;
