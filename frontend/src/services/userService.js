import http from './http';

const apiURL = '/users/';

export const registerUser = (user) => http.post(apiURL, user);
export const loginUser = (email, password) =>
	http.post(apiURL + 'login', { email, password });
export const getAllUsers = () => http.get(apiURL);
export const getUserById = (id) => http.get(apiURL + id);
export const updateUser = (id, data) => http.put(apiURL + id, data);
export const deleteUser = (id) => http.delete(apiURL + id);
export const updateUserProfile = (user) =>
	http.put(apiURL + user._id, user);
export const deleteUserProfile = () => http.delete(apiURL + 'me');
