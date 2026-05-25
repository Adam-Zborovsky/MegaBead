import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../services/productService';
import { NecklaceIcon } from '../customIcons/NecklaceIcon';
import { BraceletIcon } from '../customIcons/BraceletIcon';
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
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

type TypeFilter = 'all' | 'necklace' | 'bracelet';
type PriceFilter = 'all' | '0-200' | '200-500' | '500-1000' | '1000+';
type SortBy = 'newest' | 'price-asc' | 'price-desc' | 'name';

function Products() {
	useDocumentTitle('Shop');
	const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
	const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
	const [sortBy, setSortBy] = useState<SortBy>('newest');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const {
		data: products,
		isLoading,
		error,
	} = useQuery<Product[]>({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await getAllProducts();
			return res.data;
		},
	});

	const filtered = useMemo(() => {
		if (!products) return [];
		let list = [...products];

		if (typeFilter !== 'all') {
			list = list.filter((p) => p.type === typeFilter);
		}

		if (priceFilter !== 'all') {
			list = list.filter((p) => {
				switch (priceFilter) {
					case '0-200':
						return p.price >= 0 && p.price <= 200;
					case '200-500':
						return p.price > 200 && p.price <= 500;
					case '500-1000':
						return p.price > 500 && p.price <= 1000;
					case '1000+':
						return p.price > 1000;
					default:
						return true;
				}
			});
		}

		switch (sortBy) {
			case 'price-asc':
				list.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				list.sort((a, b) => b.price - a.price);
				break;
			case 'name':
				list.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'newest':
			default:
				break;
		}

		return list;
	}, [products, typeFilter, priceFilter, sortBy]);

	const hasActiveFilters = typeFilter !== 'all' || priceFilter !== 'all';

	const clearFilters = () => {
		setTypeFilter('all');
		setPriceFilter('all');
		setSortBy('newest');
	};

	return (
		<div className="min-h-screen bg-bone">
			{/* Header */}
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-16">
					<h1
						className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl lg:text-5xl"
						style={{ letterSpacing: '-0.02em' }}
					>
						The Shop
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-clay/70">
						A curated selection of objects intended for ritual and adornment. Each bead is shaped by
						hand in our studio, fired with intention, and assembled into a narrative that bridges
						the ancient and the modern.
					</p>
				</div>
			</section>

			{/* Filters */}
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<p className="text-sm text-clay/70">
							Showing <span className="font-medium text-clay">{filtered.length}</span>{' '}
							{filtered.length === 1 ? 'Result' : 'Results'}
						</p>
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-terracotta transition-colors hover:text-terracotta/80"
							>
								<X className="h-3 w-3" aria-hidden="true" />
								Clear
							</button>
						)}
					</div>

					{/* Desktop filters */}
					<div className="hidden items-center gap-3 md:flex">
						<select
							aria-label="Filter by type"
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
							className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
						>
							<option value="all">All Types</option>
							<option value="necklace">Necklace</option>
							<option value="bracelet">Bracelet</option>
						</select>

						<select
							aria-label="Filter by price"
							value={priceFilter}
							onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
							className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
						>
							<option value="all">All Prices</option>
							<option value="0-200">₪0 – ₪200</option>
							<option value="200-500">₪200 – ₪500</option>
							<option value="500-1000">₪500 – ₪1000</option>
							<option value="1000+">₪1000+</option>
						</select>

						<select
							aria-label="Sort products"
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as SortBy)}
							className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
						>
							<option value="newest">Newest</option>
							<option value="price-asc">Price: Low to High</option>
							<option value="price-desc">Price: High to Low</option>
							<option value="name">Name</option>
						</select>
					</div>

					{/* Mobile filter toggle */}
					<button
						onClick={() => setMobileFiltersOpen((v) => !v)}
						className="inline-flex items-center gap-2 rounded-sm border border-linen bg-bone px-3 py-2 text-sm font-medium text-clay transition-colors hover:bg-linen md:hidden"
						aria-expanded={mobileFiltersOpen}
						aria-label="Toggle filters"
					>
						<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
						Filters
					</button>
				</div>

				{/* Mobile filters panel */}
				{mobileFiltersOpen && (
					<div className="mx-auto max-w-7xl px-4 pb-4 md:hidden md:px-6">
						<div className="flex flex-col gap-3">
							<select
								aria-label="Filter by type"
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
								className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
							>
								<option value="all">All Types</option>
								<option value="necklace">Necklace</option>
								<option value="bracelet">Bracelet</option>
							</select>

							<select
								aria-label="Filter by price"
								value={priceFilter}
								onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
								className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
							>
								<option value="all">All Prices</option>
								<option value="0-200">₪0 – ₪200</option>
								<option value="200-500">₪200 – ₪500</option>
								<option value="500-1000">₪500 – ₪1000</option>
								<option value="1000+">₪1000+</option>
							</select>

							<select
								aria-label="Sort products"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as SortBy)}
								className="rounded-sm border border-linen bg-bone px-3 py-2 text-sm text-clay focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
							>
								<option value="newest">Newest</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="name">Name</option>
							</select>
						</div>
					</div>
				)}
			</section>

			{/* Product Grid */}
			<section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12">
				{isLoading && (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="animate-pulse space-y-4 rounded-lg bg-linen p-4">
								<div className="aspect-square rounded-md bg-bone" />
								<div className="h-4 w-2/3 rounded bg-bone" />
								<div className="h-4 w-1/3 rounded bg-bone" />
							</div>
						))}
					</div>
				)}

				{error && (
					<div className="rounded-lg border border-linen bg-bone p-12 text-center">
						<p className="text-clay/70">Unable to load products. Please try again later.</p>
					</div>
				)}

				{!isLoading && !error && filtered.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linen text-moss">
							<SlidersHorizontal className="h-8 w-8" aria-hidden="true" />
						</div>
						<h2 className="font-[Fraunces] text-2xl font-semibold text-clay">A Quiet Studio</h2>
						<p className="mx-auto mt-3 max-w-md text-clay/70">
							Your search didn&apos;t find a match, but there are many other treasures to discover.
							Each of our pieces is limited and often exists as a singular creation.
						</p>
						<button
							onClick={clearFilters}
							className="mt-6 inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
						>
							Return to Collection
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
				)}

				{!isLoading && !error && filtered.length > 0 && (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((product, idx) => (
							<motion.div
								key={product._id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-60px' }}
								transition={{ duration: 0.4, delay: idx * 0.05 }}
							>
								<Link
									to={`/product/${product._id}`}
									className="group block overflow-hidden rounded-lg bg-linen shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
								>
									<div className="relative aspect-square overflow-hidden bg-bone">
										<img
											src={productImageUrl(product)}
											alt={product.name}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
										<span
											className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
												product.type === 'necklace'
													? 'bg-moss/90 text-white'
													: 'bg-terracotta/90 text-white'
											}`}
										>
											{product.type === 'necklace' ? (
												<NecklaceIcon className="h-3 w-3" />
											) : (
												<BraceletIcon className="h-3 w-3" />
											)}
											{product.type}
										</span>
									</div>
									<div className="flex items-center justify-between p-5">
										<div>
											<h3 className="font-[Fraunces] text-lg font-semibold text-clay">
												{product.name}
											</h3>
											<p className="mt-1 text-sm font-medium text-clay/80">
												₪ {product.price.toLocaleString()}
											</p>
										</div>
										<ArrowRight
											className="h-5 w-5 text-clay/40 transition-colors group-hover:text-terracotta"
											aria-hidden="true"
										/>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

export default Products;
