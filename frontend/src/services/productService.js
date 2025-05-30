import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "products/";

export function getAllProducts() {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
		},
	};

	return axios.request(config);
}

export function getProductById(id) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + id,
	};

	return axios.request(config);
}

export function createProduct(product, token) {
	const formData = new FormData();
	for (const key in product) {
		formData.append(key, product[key]);
	}

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "multipart/form-data",
			"x-auth-token": token,
		},
		data: formData,
	};

	return axios.request(config);
}

export function updateProduct(id, product, token) {
	const formData = new FormData();
	for (const key in product) {
		formData.append(key, product[key]);
	}
	let config = {
		method: "put",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"Content-Type": "multipart/form-data",
			"x-auth-token": token,
		},
		data: formData,
	};

	return axios.request(config);
}

export function deleteProduct(id, token) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
	};

	return axios.request(config);
}
