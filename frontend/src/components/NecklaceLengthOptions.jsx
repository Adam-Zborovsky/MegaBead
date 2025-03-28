import { useState, useEffect } from "react";

function NecklaceLengthOptions({ length, onLengthChange }) {
	const [selectedOption, setSelectedOption] = useState("42");
	const [customValue, setCustomValue] = useState("");

	useEffect(() => {
		if ([39, 42, 45].includes(length)) {
			setSelectedOption(length.toString());
			setCustomValue("");
		} else {
			setSelectedOption("custom");
			setCustomValue(length.toString());
		}
	}, [length]);

	const handleOptionChange = (e) => {
		const val = e.target.value;
		setSelectedOption(val);

		if (val === "custom") {
			if (customValue) {
				onLengthChange(parseFloat(customValue) || 0);
			}
		} else {
			onLengthChange(parseFloat(val));
		}
	};

	const handleCustomChange = (e) => {
		const val = e.target.value;
		setCustomValue(val);
		if (selectedOption === "custom" && val < 60 && val > 20) {
			onLengthChange(parseFloat(val) || 0);
		}
	};

	return (
		<div className="card shadow-sm p-3 my-3 w-50">
			<h5 className="card-title mb-3" style={{ margin: "auto" }}>
				Necklace Length
			</h5>

			<div className="row g-2 mb-3">
				<div className="col-6 col-md-3">
					<label
						className={`btn w-100 ${
							selectedOption === "39" ? "btn-primary" : "btn-outline-primary"
						}`}
					>
						<input
							type="radio"
							name="lengthOption"
							value="39"
							className="d-none"
							checked={selectedOption === "39"}
							onChange={handleOptionChange}
						/>
						39 cm
					</label>
				</div>

				<div className="col-6 col-md-3">
					<label
						className={`btn w-100 ${
							selectedOption === "42" ? "btn-primary" : "btn-outline-primary"
						}`}
					>
						<input
							type="radio"
							name="lengthOption"
							value="42"
							className="d-none"
							checked={selectedOption === "42"}
							onChange={handleOptionChange}
						/>
						42 cm
					</label>
				</div>

				<div className="col-6 col-md-3">
					<label
						className={`btn w-100 ${
							selectedOption === "45" ? "btn-primary" : "btn-outline-primary"
						}`}
					>
						<input
							type="radio"
							name="lengthOption"
							value="45"
							className="d-none"
							checked={selectedOption === "45"}
							onChange={handleOptionChange}
						/>
						45 cm
					</label>
				</div>

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

			{selectedOption === "custom" && (
				<div className="mb-3">
					<label className="form-label">Enter Custom Length (cm):</label>
					<input
						type="number"
						className="form-control"
						value={customValue}
						onChange={handleCustomChange}
						placeholder="e.g 50"
					/>
				</div>
			)}
		</div>
	);
}

export default NecklaceLengthOptions;
