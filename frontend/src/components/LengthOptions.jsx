import { useState, useEffect } from "react";
import { NecklaceIcon } from "../customIcons/NecklaceIcon";
import { BraceletIcon } from "../customIcons/BraceletIcon";

function LengthOptions({ length, onLengthChange }) {
	const [selectedType, setSelectedType] = useState("necklace");
	const [selectedOption, setSelectedOption] = useState("42");
	const [customValue, setCustomValue] = useState("");

	// Sync incoming `length` and reset when type changes
	useEffect(() => {
		const num = parseFloat(length);
		const necklaceOpts = [39, 42, 45];
		const braceletOpts = [14, 17, 20];

		if (selectedType === "necklace") {
			if (necklaceOpts.includes(num)) {
				setSelectedOption(num.toString());
				setCustomValue("");
			} else {
				setSelectedOption("42");
				setCustomValue("");
				onLengthChange(42);
			}
		} else {
			if (braceletOpts.includes(num)) {
				setSelectedOption(num.toString());
				setCustomValue("");
			} else {
				setSelectedOption("17");
				setCustomValue("");
				onLengthChange(17);
			}
		}
	}, [length, selectedType, onLengthChange]);

	const handleOptionChange = (e) => {
		const val = e.target.value;
		setSelectedOption(val);
		if (val !== "custom") {
			onLengthChange(parseInt(val));
		}
	};

	const handleCustomChange = (e) => {
		const val = e.target.value;
		setCustomValue(val);
		if (selectedOption === "custom" && val && val > 25 && val < 60) {
			onLengthChange(parseInt(val) || 0);
		}
	};

	const options = selectedType === "necklace" ? [39, 42, 45] : [14, 17, 20];

	return (
		<div
			className="card shadow-sm p-3 w-50 "
			style={{ maxWidth: "400px", marginBottom: "1rem" }}
		>
			{/* single sliding pill toggle */}
			<div className="d-flex position-relative border rounded-pill overflow-hidden mb-3">
				<span
					className="position-absolute top-0 bottom-0 bg-primary rounded-pill"
					style={{
						width: "50%",
						left: selectedType === "necklace" ? 0 : "50%",
						transition: "left 0.3s ease",
					}}
				/>
				{["necklace", "bracelet"].map((type) => (
					<button
						key={type}
						type="button"
						className={`flex-fill text-center py-1 btn fw-bold ${
							selectedType === type ? "text-primary-text" : "text-primary"
						}`}
						onClick={() => setSelectedType(type)}
						style={{ background: "transparent", border: "none", zIndex: 1 }}
					>
						{type === "necklace" ? <NecklaceIcon /> : <BraceletIcon />}
					</button>
				))}
			</div>

			{/* Size options */}
			<div className="row g-2 mb-3">
				{options.map((opt) => (
					<div className="col-6 col-md-3" key={opt}>
						<label
							className={`btn w-100 ${
								selectedOption === opt.toString()
									? "btn-primary"
									: "btn-outline-primary"
							}`}
						>
							<input
								type="radio"
								name="lengthOption"
								value={opt.toString()}
								className="d-none"
								checked={selectedOption === opt.toString()}
								onChange={handleOptionChange}
							/>
							{opt} cm
						</label>
					</div>
				))}

				{/* Always include “Custom” */}
				<div className="col-6 col-md-3">
					<label
						className={`btn w-100 ${
							selectedOption === "custom"
								? "btn-primary"
								: "btn-outline-primary"
						}`}
					>
						<input
							type="radio"
							name="lengthOption"
							value="custom"
							className="d-none"
							checked={selectedOption === "custom"}
							onChange={handleOptionChange}
						/>
						Custom
					</label>
				</div>
			</div>

			{/* Custom input */}
			{selectedOption === "custom" && (
				<div className="mb-3">
					<label className="form-label">
						Enter Custom {selectedType === "necklace" ? "Necklace" : "Bracelet"}{" "}
						Length (cm):
					</label>
					<input
						type="number"
						className="form-control"
						value={customValue}
						onChange={handleCustomChange}
						placeholder={`e.g. ${selectedType === "necklace" ? 50 : 15}`}
					/>
				</div>
			)}
		</div>
	);
}

export default LengthOptions;
