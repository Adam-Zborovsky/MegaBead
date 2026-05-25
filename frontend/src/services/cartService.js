import http from './http';

const apiURL = '/cart/';

export const getCart = (id) => http.get(apiURL + id);
export const addToCart = (item) => http.post(apiURL, item);
export const removeFromCart = (userId, productId) =>
	http.delete(apiURL, { data: { userId, productId } });
export const addCustomProductToCart = (customProduct, quantity) =>
	http.post(apiURL, { customProduct, quantity });
