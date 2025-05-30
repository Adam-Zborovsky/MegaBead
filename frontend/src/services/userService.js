import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "users/";

export function registerUser(user) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
		},
		data: user,
	};

	return axios.request(config);
}

export function loginUser(email, password) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL + "login",
		headers: {
			"Content-Type": "application/json",
		},
		data: { email: email, password: password },
	};

	return axios.request(config);
}

export function getAllUsers(token) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
	};

	return axios.request(config);
}

export function getUserById(id, token) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
	};
	return axios.request(config);
}

export function updateUser(id, data, token) {
	let config = {
		method: "put",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
		data: data,
	};

	return axios.request(config);
}

export function deleteUser(id, token) {
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

export function updateUserProfile(user, token) {
	let config = {
		method: "put",
		maxBodyLength: Infinity,
		url: apiURL + user._id,
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
		data: user,
	};

	return axios.request(config);
}

export function deleteUserProfile(token) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL + "me",
		headers: {
			"Content-Type": "application/json",
			"x-auth-token": token,
		},
	};

	return axios.request(config);
}
