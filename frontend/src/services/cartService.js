import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "cart/";

export function getCart(id, token) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": token,
		},
	};

	return axios.request(config);
}

export function addToCart(item, token) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
		data: item,
	};

	return axios.request(config);
}

export function removeFromCart(userId, productId, token) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
		data: {
			userId: userId,
			productId: productId,
		},
	};

	return axios.request(config);
}

export function addCustomProductToCart(customProduct, quantity, token) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
		data: {
			customProduct,
			quantity,
		},
	};

	return axios.request(config);
}
