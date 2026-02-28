import { useState, useContext, useEffect } from "react";
import {
	createProduct,
	getProductById,
	updateProduct,
} from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductUpload = () => {
	const { token } = useContext(AuthContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		type: "",
		description: "",
		image: null,
	});
	const [previewImage, setPreviewImage] = useState(null);

	useEffect(() => {
		if (id) {
			getProductById(id)
				.then((res) => {
					setFormData({
						name: res.data.name,
						price: res.data.price,
						type: res.data.type,
						description: res.data.description,
						image: null,
					});
					setPreviewImage(res.data.image);
				})
				.catch((err) => console.error("Failed to fetch product details", err));
		}
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setFormData({ ...formData, image: file });
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (id) {
				await updateProduct(id, formData, token);
			} else {
				formData.price = formData.price + " ₪";
				await createProduct(formData, token);
			}
		} catch (error) {
			console.error(error);
			alert("Failed to upload product.");
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h2 className="text-primary text-center">
				{id ? "Edit Product" : "Upload Product"}
			</h2>
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
						Price (₪)
					</label>
					<input
						type="text"
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
					/>
					{id && previewImage ? (
						<div className="mt-3 text-center">
							<img
								src={`${process.env.REACT_APP_API_URL}/${previewImage}`}
								alt={formData.name}
								className="img-thumbnail"
								style={{ width: "150px", height: "150px" }}
							/>
						</div>
					) : previewImage ? (
						<div className="mt-3 text-center">
							<img
								src={previewImage}
								alt="Preview"
								className="img-thumbnail"
								style={{ width: "150px", height: "150px" }}
							/>
						</div>
					) : null}
				</div>
				<div className="text-center">
					<button
						type="submit"
						className="btn btn-primary"
						onClick={() => {
							toast.success(
								id
									? "Product updated successfully!"
									: "Product uploaded successfully!"
							);
							navigate("/manage_products");
						}}
					>
						{id ? "Update" : "Submit"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProductUpload;
