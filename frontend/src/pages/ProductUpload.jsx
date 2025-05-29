import { useState, useContext } from "react";
import { createProduct } from "../services/productServices";
import { AuthContext } from "../context/AuthContext";

const ProductUpload = () => {
	const { token } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		type: "",
		description: "",
		image: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			formData.price = formData.price + " ₪";
			await createProduct(formData, token);
		} catch (error) {
			console.error(error);
			alert("Failed to upload product.");
		}
	};

	return (
		<div className="container mt-5">
			<div className="window">
				<h2 className="text-primary">Upload Product</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							Product Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="form-control"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="price" className="form-label">
							Price
						</label>
						<input
							type="number"
							id="price"
							name="price"
							className="form-control"
							value={formData.price}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="type" className="form-label">
							Type
						</label>
						<input
							type="text"
							id="type"
							name="type"
							className="form-control"
							value={formData.type}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							className="form-control"
							value={formData.description}
							onChange={handleChange}
							required
						></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="image" className="form-label">
							Image
						</label>
						<input
							type="file"
							id="image"
							name="image"
							className="form-control"
							onChange={handleFileChange}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default ProductUpload;
