import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, deleteProduct } from '../services/productService';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, SlidersHorizontal, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Product {
	_id: string;
	name: string;
	type: 'necklace' | 'bracelet';
	price: number;
	image: string | null;
}

const productImageUrl = (product: Product): string =>
	product.image
		? `${import.meta.env.VITE_API_URL}/images/${product.image}`
		: `/images/default_${product.type}.png`;

const tabs = [
	{ key: 'all', label: 'All Pieces' },
	{ key: 'necklace', label: 'Necklaces' },
	{ key: 'bracelet', label: 'Bracelets' },
];

function ManageProducts() {
	useDocumentTitle('Manage products');
	const [typeFilter, setTypeFilter] = useState<'all' | 'necklace' | 'bracelet'>('all');
	const [search, setSearch] = useState('');
	const queryClient = useQueryClient();

	const { data: products, isLoading } = useQuery<Product[]>({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await getAllProducts();
			return res.data;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success('Product deleted');
		},
		onError: () => {
			toast.error('Failed to delete product');
		},
	});

	const filtered = products?.filter((p) => {
		const matchesType = typeFilter === 'all' || p.type === typeFilter;
		const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
		return matchesType && matchesSearch;
	});

	return (
		<div className="min-h-screen bg-bone">
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 md:flex-row md:items-center md:px-6 lg:px-8">
					<div>
						<h1
							className="font-[Fraunces] text-3xl font-semibold text-clay"
							style={{ letterSpacing: '-0.01em' }}
						>
							Manage Inventory
						</h1>
						<p className="mt-1 text-sm text-clay/70">
							Maintaining the standard of artisanal excellence.
						</p>
					</div>
					<Link
						to="/create_product"
						className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
					>
						<Plus className="h-4 w-4" aria-hidden="true" />
						Upload new product
					</Link>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
				{/* Filters */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-1">
						{tabs.map((tab) => {
							const active = typeFilter === tab.key;
							return (
								<button
									key={tab.key}
									onClick={() => setTypeFilter(tab.key as typeof typeFilter)}
									className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
										active
											? 'bg-linen text-terracotta'
											: 'text-clay/70 hover:bg-linen hover:text-clay'
									}`}
								>
									{tab.label}
								</button>
							);
						})}
					</div>

					<div className="relative max-w-xs">
						<Search
							className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
							aria-hidden="true"
						/>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search products..."
							className="w-full rounded-sm border border-linen bg-bone py-2 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
						/>
					</div>
				</div>

				{/* Table */}
				<div className="mt-6 overflow-hidden rounded-lg border border-linen bg-bone shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-linen">
							<thead className="bg-linen">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-clay/70">
										Preview
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-clay/70">
										Product
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-clay/70">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-clay/70">
										Price
									</th>
									<th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-clay/70">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-linen">
								{isLoading &&
									[0, 1, 2].map((i) => (
										<tr key={i} className="animate-pulse">
											<td className="px-6 py-4">
												<div className="h-12 w-12 rounded-md bg-linen" />
											</td>
											<td className="px-6 py-4">
												<div className="h-4 w-32 rounded bg-linen" />
											</td>
											<td className="px-6 py-4">
												<div className="h-4 w-16 rounded bg-linen" />
											</td>
											<td className="px-6 py-4">
												<div className="h-4 w-12 rounded bg-linen" />
											</td>
											<td className="px-6 py-4">
												<div className="h-4 w-20 rounded bg-linen" />
											</td>
										</tr>
									))}

								{!isLoading && filtered && filtered.length === 0 && (
									<tr>
										<td colSpan={5} className="px-6 py-16 text-center">
											<div className="flex flex-col items-center">
												<SlidersHorizontal className="h-8 w-8 text-clay/30" aria-hidden="true" />
												<p className="mt-3 text-clay/70">No products match your filters.</p>
												<button
													onClick={() => {
														setTypeFilter('all');
														setSearch('');
													}}
													className="mt-3 text-sm font-medium text-terracotta underline underline-offset-4"
												>
													Clear filters
												</button>
											</div>
										</td>
									</tr>
								)}

								{!isLoading &&
									filtered?.map((product, idx) => (
										<motion.tr
											key={product._id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: idx * 0.03 }}
											className="hover:bg-linen/50"
										>
											<td className="whitespace-nowrap px-6 py-4">
												<img
													src={productImageUrl(product)}
													alt={product.name}
													className="h-12 w-12 rounded-md object-cover"
													loading="lazy"
												/>
											</td>
											<td className="px-6 py-4">
												<p className="text-sm font-medium text-clay">{product.name}</p>
											</td>
											<td className="px-6 py-4">
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
														product.type === 'necklace'
															? 'bg-moss/10 text-moss'
															: 'bg-terracotta/10 text-terracotta'
													}`}
												>
													{product.type}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-clay/80">
												₪ {product.price.toLocaleString()}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right">
												<div className="flex items-center justify-end gap-3">
													<Link
														to={`/edit_product/${product._id}`}
														className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-sm font-medium text-clay transition-colors hover:bg-linen"
													>
														<Pencil className="h-4 w-4" aria-hidden="true" />
														Edit
													</Link>
													<button
														onClick={() => deleteMutation.mutate(product._id)}
														disabled={deleteMutation.isPending}
														className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
													>
														<Trash2 className="h-4 w-4" aria-hidden="true" />
														Delete
													</button>
												</div>
											</td>
										</motion.tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ManageProducts;
