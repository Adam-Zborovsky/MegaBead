import { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/productService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { NecklaceIcon } from '../customIcons/NecklaceIcon';
import { BraceletIcon } from '../customIcons/BraceletIcon';
import { ShoppingBag, ChevronDown, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Product {
	_id: string;
	name: string;
	type: 'necklace' | 'bracelet';
	price: number;
	image: string | null;
	description?: string;
}

const productImageUrl = (product: Product): string =>
	product.image
		? `${import.meta.env.VITE_API_URL}/images/${product.image}`
		: `/images/default_${product.type}.png`;

function ProductDetails() {
	useDocumentTitle('Product');
	const { id } = useParams<{ id: string }>();

	const { addItemToCart } = useContext(CartContext) as {
		addItemToCart: (item: { productId: string; quantity: number }) => Promise<void>;
	};
	const { user } = useContext(AuthContext) as { user: { _id: string } | null };

	const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
		description: true,
		materials: false,
		shipping: false,
	});

	const {
		data: product,
		isLoading,
		error,
	} = useQuery<Product>({
		queryKey: ['product', id],
		queryFn: async () => {
			const res = await getProductById(id!);
			return res.data;
		},
		enabled: !!id,
	});

	const toggleAccordion = (key: string) => {
		setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleAddToCart = () => {
		if (!product || !user) return;
		addItemToCart({ productId: product._id, quantity: 1 });
	};

	if (isLoading) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-2">
					<div className="aspect-square animate-pulse rounded-lg bg-linen" />
					<div className="space-y-6">
						<div className="h-8 w-2/3 animate-pulse rounded bg-linen" />
						<div className="h-6 w-1/3 animate-pulse rounded bg-linen" />
						<div className="h-4 w-full animate-pulse rounded bg-linen" />
						<div className="h-4 w-5/6 animate-pulse rounded bg-linen" />
						<div className="h-12 w-40 animate-pulse rounded bg-linen" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6 lg:px-8">
				<h2 className="font-[Fraunces] text-2xl font-semibold text-clay">Piece Not Found</h2>
				<p className="mx-auto mt-3 max-w-md text-clay/70">
					We couldn&apos;t locate this item. It may have been removed or the link might be
					incorrect.
				</p>
				<Link
					to="/products"
					className="mt-6 inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Back to Shop
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-bone">
			<div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12">
				{/* Breadcrumb */}
				<nav aria-label="Breadcrumb" className="mb-6">
					<ol className="flex items-center gap-2 text-sm text-clay/60">
						<li>
							<Link to="/" className="transition-colors hover:text-terracotta">
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link to="/products" className="transition-colors hover:text-terracotta">
								Shop
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li className="text-clay" aria-current="page">
							{product.name}
						</li>
					</ol>
				</nav>

				<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Image */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="overflow-hidden rounded-lg bg-linen shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
							<img
								src={productImageUrl(product)}
								alt={product.name}
								className="aspect-square w-full object-cover"
								loading="eager"
							/>
						</div>
					</motion.div>

					{/* Info */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="flex flex-col"
					>
						<span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
							Handcrafted
						</span>

						<div className="flex items-center gap-3">
							<h1
								className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
								style={{ letterSpacing: '-0.01em' }}
							>
								{product.name}
							</h1>
							{product.type === 'necklace' ? (
								<NecklaceIcon className="h-8 w-8 text-clay" />
							) : (
								<BraceletIcon className="h-8 w-8 text-clay" />
							)}
						</div>

						<p className="mt-2 text-2xl font-medium text-clay/90">
							₪ {product.price.toLocaleString()}
						</p>

						<div className="mt-8">
							{user ? (
								<button
									onClick={handleAddToCart}
									className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
								>
									<ShoppingBag className="h-4 w-4" aria-hidden="true" />
									Add to cart
								</button>
							) : (
								<Link
									to="/login"
									className="inline-flex items-center gap-2 rounded-sm border border-linen bg-bone px-6 py-3 text-sm font-medium text-clay transition-colors hover:bg-linen"
								>
									Log in to add to cart
								</Link>
							)}
						</div>

						{/* Accordions */}
						<div className="mt-10 space-y-3">
							{/* Description */}
							<div className="rounded-lg border border-linen bg-bone">
								<button
									onClick={() => toggleAccordion('description')}
									className="flex w-full items-center justify-between px-5 py-4 text-left"
									aria-expanded={openAccordions.description}
								>
									<span className="text-sm font-semibold text-clay">Description</span>
									<ChevronDown
										className={`h-5 w-5 text-clay/60 transition-transform duration-200 ${
											openAccordions.description ? 'rotate-180' : ''
										}`}
										aria-hidden="true"
									/>
								</button>
								{openAccordions.description && (
									<div className="px-5 pb-5">
										<p className="text-sm leading-relaxed text-clay/70">
											{product.description ||
												'A handcrafted piece from the MegaBead atelier, shaped with intention and assembled with care.'}
										</p>
									</div>
								)}
							</div>

							{/* Materials */}
							<div className="rounded-lg border border-linen bg-bone">
								<button
									onClick={() => toggleAccordion('materials')}
									className="flex w-full items-center justify-between px-5 py-4 text-left"
									aria-expanded={openAccordions.materials}
								>
									<span className="text-sm font-semibold text-clay">Materials</span>
									<ChevronDown
										className={`h-5 w-5 text-clay/60 transition-transform duration-200 ${
											openAccordions.materials ? 'rotate-180' : ''
										}`}
										aria-hidden="true"
									/>
								</button>
								{openAccordions.materials && (
									<div className="px-5 pb-5">
										<ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-clay/70">
											<li>Hand-rolled terracotta beads</li>
											<li>Ethically sourced natural stone</li>
											<li>Organic cotton cordage</li>
											<li>Hand-forged brass findings</li>
										</ul>
									</div>
								)}
							</div>

							{/* Shipping */}
							<div className="rounded-lg border border-linen bg-bone">
								<button
									onClick={() => toggleAccordion('shipping')}
									className="flex w-full items-center justify-between px-5 py-4 text-left"
									aria-expanded={openAccordions.shipping}
								>
									<span className="text-sm font-semibold text-clay">Shipping &amp; Returns</span>
									<ChevronDown
										className={`h-5 w-5 text-clay/60 transition-transform duration-200 ${
											openAccordions.shipping ? 'rotate-180' : ''
										}`}
										aria-hidden="true"
									/>
								</button>
								{openAccordions.shipping && (
									<div className="px-5 pb-5">
										<p className="text-sm leading-relaxed text-clay/70">
											Worldwide tracked shipping from our studio. As each piece is made to order,
											please allow 5–7 business days for creation. Returns are accepted within 14
											days of delivery for original, unworn pieces.
										</p>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetails;
