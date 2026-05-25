import http from './http';

const apiURL = '/products/';

export const getAllProducts = () => http.get(apiURL);
export const getProductById = (id) => http.get(apiURL + id);
export const createProduct = (data) =>
	http.post(apiURL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) =>
	http.put(apiURL + id, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => http.delete(apiURL + id);
