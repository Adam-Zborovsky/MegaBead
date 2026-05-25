import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { updateUser } from '../services/userService';
import { toast } from 'react-toastify';
import AddShippingModal from '../components/AddShippingModal';
import AddPaymentModal from '../components/AddPaymentModal';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Wrench, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface CartProduct {
	_id: string;
	name: string;
	price: number;
	image: string | null;
	description?: string;
	type?: string;
}

interface CartItem {
	productId?: CartProduct;
	customProduct?: {
		name: string;
		price: number;
		description?: string;
		type: string;
		isTemporary?: boolean;
	};
	quantity: number;
}

interface UserData {
	_id: string;
	shippingOptions: {
		addressLine1: string;
		city: string;
		state: string;
	}[];
	paymentOptions: {
		cardNumber: string;
		cardType?: string;
	}[];
}

function Cart() {
	useDocumentTitle('Your cart');
	const { cart, addItemToCart, removeItemFromCart } = useContext(CartContext) as {
		cart: CartItem[];
		addItemToCart: (item: { productId: string; quantity: number }) => Promise<void>;
		removeItemFromCart: (productId: string) => Promise<void>;
	};
	const { user } = useContext(AuthContext) as { user: UserData | null };
	const [shippingOption, setShippingOption] = useState('');
	const [paymentOption, setPaymentOption] = useState('');
	const [showShippingModal, setShowShippingModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const subtotal = cart.reduce((sum, item) => {
		const price = item.productId ? item.productId.price : item.customProduct?.price || 0;
		return sum + price * item.quantity;
	}, 0);

	const handleIncrement = async (item: CartItem) => {
		if (item.productId) {
			await addItemToCart({ productId: item.productId._id, quantity: 1 });
		}
	};

	const handleRemove = async (item: CartItem) => {
		try {
			if (item.productId) {
				await removeItemFromCart(item.productId._id);
			} else if (item.customProduct) {
				// Custom products aren't handled by removeItemFromCart; update user directly
				const updatedCart = cart.filter((c) => c.customProduct?.name !== item.customProduct?.name);
				await updateUser(user!._id, { cart: updatedCart });
				toast.success('Item removed');
			}
		} catch {
			toast.error('Failed to remove item.');
		}
	};

	const handleCheckout = async () => {
		try {
			const updatedCart = cart.filter((item) => !item.customProduct?.isTemporary);
			await updateUser(user!._id, { cart: updatedCart });
			toast.success('Cart saved!');
		} catch {
			toast.error('Save failed. Please try again.');
		}
	};

	if (cart.length === 0) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
				<div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linen text-moss">
					<ShoppingBag className="h-8 w-8" aria-hidden="true" />
				</div>
				<h2 className="font-[Fraunces] text-2xl font-semibold text-clay">Your cart is waiting</h2>
				<p className="mx-auto mt-3 max-w-md text-clay/70">
					Begin your journey in the atelier where materials find their form.
				</p>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Link
						to="/builder"
						className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
					>
						<Wrench className="h-4 w-4" aria-hidden="true" />
						The Builder
					</Link>
					<Link
						to="/products"
						className="inline-flex items-center gap-2 rounded-sm border border-linen bg-bone px-5 py-2.5 text-sm font-medium text-clay transition-colors hover:bg-linen"
					>
						<ShoppingBag className="h-4 w-4" aria-hidden="true" />
						The Shop
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-bone">
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
					<h1
						className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
						style={{ letterSpacing: '-0.01em' }}
					>
						Your Atelier Selection
					</h1>
					<p className="mt-2 text-clay/70">Hand-picked treasures, awaiting their journey home.</p>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Line Items */}
					<div className="space-y-6 lg:col-span-2">
						{cart.map((item, idx) => {
							const isProduct = !!item.productId;
							const name = isProduct ? item.productId!.name : item.customProduct!.name;
							const price = isProduct ? item.productId!.price : item.customProduct!.price;
							const image = isProduct
								? item.productId!.image
									? `${import.meta.env.VITE_API_URL}/images/${item.productId!.image}`
									: `/images/default_${item.productId!.type}.png`
								: `/images/default_${item.customProduct!.type}.png`;
							const desc = isProduct
								? item.productId!.description
								: item.customProduct!.description;

							return (
								<motion.div
									key={`${name}-${idx}`}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: idx * 0.05 }}
									className="flex gap-5 rounded-lg border border-linen bg-bone p-4 sm:p-6"
								>
									<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-linen sm:h-32 sm:w-32">
										<img
											src={image}
											alt={name}
											className="h-full w-full object-cover"
											loading="lazy"
										/>
									</div>
									<div className="flex flex-1 flex-col justify-between">
										<div>
											<h3 className="font-[Fraunces] text-lg font-semibold text-clay">{name}</h3>
											{desc && <p className="mt-1 line-clamp-2 text-sm text-clay/60">{desc}</p>}
											<p className="mt-2 text-sm font-medium text-clay/90">
												₪ {price.toLocaleString()}
											</p>
										</div>
										<div className="mt-4 flex items-center justify-between">
											<div className="flex items-center gap-3">
												{isProduct && (
													<>
														<button
															onClick={() => handleRemove(item)}
															className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-linen text-clay transition-colors hover:bg-linen"
															aria-label="Decrease quantity"
														>
															<Minus className="h-4 w-4" aria-hidden="true" />
														</button>
														<span className="min-w-[1.5rem] text-center text-sm font-medium text-clay">
															{item.quantity}
														</span>
														<button
															onClick={() => handleIncrement(item)}
															className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-linen text-clay transition-colors hover:bg-linen"
															aria-label="Increase quantity"
														>
															<Plus className="h-4 w-4" aria-hidden="true" />
														</button>
													</>
												)}
												{!isProduct && (
													<span className="text-xs font-medium uppercase tracking-wider text-moss">
														Custom
													</span>
												)}
											</div>
											<button
												onClick={() => handleRemove(item)}
												className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" aria-hidden="true" />
												Remove
											</button>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Summary */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 rounded-lg border border-linen bg-bone p-6 shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
							<h2 className="font-[Fraunces] text-lg font-semibold text-clay">Atelier Summary</h2>

							<div className="mt-6 space-y-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-clay/70">Subtotal</span>
									<span className="font-medium text-clay">₪ {subtotal.toLocaleString()}</span>
								</div>

								<div>
									<label htmlFor="shipping" className="mb-1.5 block text-sm font-medium text-clay">
										Shipping method
									</label>
									<select
										id="shipping"
										value={shippingOption}
										onChange={(e) => setShippingOption(e.target.value)}
										className="w-full rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									>
										<option value="">Select Address</option>
										{user?.shippingOptions?.map((opt, i) => (
											<option key={i} value={opt.addressLine1}>
												{opt.addressLine1}, {opt.city}
											</option>
										))}
									</select>
									<button
										onClick={() => setShowShippingModal(true)}
										className="mt-2 text-xs font-medium text-terracotta underline underline-offset-2 transition-colors hover:text-terracotta/80"
									>
										Add shipping address
									</button>
								</div>

								<div>
									<label htmlFor="payment" className="mb-1.5 block text-sm font-medium text-clay">
										Payment method
									</label>
									<select
										id="payment"
										value={paymentOption}
										onChange={(e) => setPaymentOption(e.target.value)}
										className="w-full rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									>
										<option value="">Select Card</option>
										{user?.paymentOptions?.map((opt, i) => (
											<option key={i} value={opt.cardNumber}>
												•••• {opt.cardNumber.slice(-4)}
											</option>
										))}
									</select>
									<button
										onClick={() => setShowPaymentModal(true)}
										className="mt-2 text-xs font-medium text-terracotta underline underline-offset-2 transition-colors hover:text-terracotta/80"
									>
										Add payment method
									</button>
								</div>

								<div className="border-t border-linen pt-4">
									<div className="flex items-center justify-between">
										<span className="text-base font-semibold text-clay">Total</span>
										<span className="text-base font-semibold text-clay">
											₪ {subtotal.toLocaleString()}
										</span>
									</div>
									<p className="mt-1 text-xs text-clay/50">Taxes included</p>
								</div>

								<button
									onClick={handleCheckout}
									className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-terracotta px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
								>
									Save Cart
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</button>

								<div className="flex items-center justify-center gap-1.5 text-xs text-clay/50">
									<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
									Secure studio transaction
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{showShippingModal && <AddShippingModal onClose={() => setShowShippingModal(false)} />}
			{showPaymentModal && (
				<AddPaymentModal onClose={() => setShowPaymentModal(false)} onSubmit={() => {}} />
			)}
		</div>
	);
}

export default Cart;
