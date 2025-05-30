import { createContext, useState, useEffect, useContext } from "react";
import {
	getCart,
	addToCart,
	removeFromCart,
	addCustomProductToCart,
} from "../services/cartService";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const { user, token } = useContext(AuthContext);

	useEffect(() => {
		if (!user) {
			setCart([]);
			return;
		}
		getCart(user._id, token)
			.then((res) => {
				if (res.data) {
					setCart(res.data.cart);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch cart", err);
				setCart([]);
			});
	}, [user, token]);

	const addItemToCart = async (item) => {
		await addToCart(item, token);
		toast.success("Item added to cart successfully!");
		setCart((prevCart) => [...prevCart, item]);
	};

	const removeItemFromCart = async (productId) => {
		await removeFromCart(user._id, productId, token);
		setCart((prevCart) =>
			prevCart.filter((item) => item.productId !== productId)
		);
	};

	const addCustomItemToCart = async (customProduct, quantity) => {
		toast.success("Item added to cart successfully!");
		await addCustomProductToCart(customProduct, quantity, token);
		setCart((prevCart) => [...prevCart, { customProduct, quantity }]);
	};

	return (
		<CartContext.Provider
			value={{ cart, addItemToCart, removeItemFromCart, addCustomItemToCart }}
		>
			{children}
		</CartContext.Provider>
	);
};
