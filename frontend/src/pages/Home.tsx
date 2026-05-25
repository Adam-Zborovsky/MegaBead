import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../services/productService';
import { ArrowRight, Wrench, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

function Home() {
	useDocumentTitle('');
	const [isMobile, setIsMobile] = useState(false);
	const [email, setEmail] = useState('');

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

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

	const featured = products?.slice(0, 3) ?? [];

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		toast.success('Welcome to the atelier circle!');
		setEmail('');
	};

	return (
		<div className="min-h-screen bg-bone">
			{/* Hero */}
			<section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className="space-y-6"
					>
						<h1
							className="font-[Fraunces] text-4xl font-semibold leading-tight text-clay md:text-5xl lg:text-6xl"
							style={{ letterSpacing: '-0.02em' }}
						>
							Design Your Custom Necklace
						</h1>
						<p className="max-w-lg text-lg leading-relaxed text-clay/80">
							Every bead tells a story. Create a piece that reflects your journey through our
							meditative builder, handcrafted with pure intention.
						</p>
						<div className="flex flex-wrap items-center gap-4">
							{isMobile ? (
								<span className="inline-flex items-center gap-2 rounded-sm bg-linen px-5 py-3 text-sm font-medium text-clay/70">
									Builder is desktop-only
								</span>
							) : (
								<Link
									to="/builder"
									className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
								>
									Start Building
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</Link>
							)}
							<Link
								to="/products"
								className="inline-flex items-center gap-2 text-sm font-medium text-clay underline underline-offset-4 transition-colors hover:text-terracotta"
							>
								Explore Collections
							</Link>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
						className="relative"
					>
						<div className="aspect-[4/3] overflow-hidden rounded-lg bg-linen shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
							<img
								src="/images/assets/hero-artisan.jpg"
								alt="Young artisan holding a handcrafted beaded necklace in her sunlit studio"
								className="h-full w-full object-cover"
								loading="eager"
							/>
						</div>
						<div className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-full bg-moss/10 lg:block" />
						<div className="absolute -right-4 -top-4 hidden h-16 w-16 rounded-full bg-terracotta/10 lg:block" />
					</motion.div>
				</div>
			</section>

			{/* Choose Your Path */}
			<section className="border-t border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
					<div className="mb-12 text-center">
						<h2
							className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
							style={{ letterSpacing: '-0.01em' }}
						>
							Choose Your Path
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-clay/70">
							Whether you seek the wisdom of our curated collections or the freedom of
							self-expression, we guide every step.
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={{ duration: 0.5 }}
							className="group flex flex-col justify-between rounded-lg bg-linen p-8 shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
						>
							<div className="space-y-4">
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bone text-terracotta">
									<ShoppingBag className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-[Fraunces] text-2xl font-semibold text-clay">The Shop</h3>
								<p className="text-clay/70">
									Browse our seasonal capsules. Each piece is limited-run, inspired by the shifting
									landscapes of the Mediterranean coast.
								</p>
							</div>
							<Link
								to="/products"
								className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta/80"
							>
								Explore Collections
								<ArrowRight
									className="h-4 w-4 transition-transform group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</Link>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="group flex flex-col justify-between rounded-lg bg-linen p-8 shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
						>
							<div className="space-y-4">
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bone text-moss">
									<Wrench className="h-6 w-6" aria-hidden="true" />
								</div>
								<h3 className="font-[Fraunces] text-2xl font-semibold text-clay">The Builder</h3>
								<p className="text-clay/70">
									A tactile digital experience. Select each bead for its meaning, texture, and
									weight to create a truly singular companion.
								</p>
							</div>
							{isMobile ? (
								<span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-clay/50">
									Desktop only
								</span>
							) : (
								<Link
									to="/builder"
									className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta/80"
								>
									Start Custom Design
									<ArrowRight
										className="h-4 w-4 transition-transform group-hover:translate-x-1"
										aria-hidden="true"
									/>
								</Link>
							)}
						</motion.div>
					</div>
				</div>
			</section>

			{/* Editor's Choice */}
			<section className="border-t border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
					<div className="mb-12 flex items-end justify-between">
						<div>
							<p className="mb-2 text-xs font-semibold uppercase tracking-widest text-terracotta">
								Editor&apos;s Choice
							</p>
							<h2
								className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
								style={{ letterSpacing: '-0.01em' }}
							>
								Curated Essentials
							</h2>
						</div>
						<Link
							to="/products"
							className="hidden items-center gap-2 text-sm font-medium text-clay underline underline-offset-4 transition-colors hover:text-terracotta sm:inline-flex"
						>
							View all shop items
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>

					{isLoading && (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{[0, 1, 2].map((i) => (
								<div key={i} className="animate-pulse space-y-4 rounded-lg bg-linen p-4">
									<div className="aspect-square rounded-md bg-bone" />
									<div className="h-4 w-2/3 rounded bg-bone" />
									<div className="h-4 w-1/3 rounded bg-bone" />
								</div>
							))}
						</div>
					)}

					{error && (
						<div className="rounded-lg border border-linen bg-bone p-8 text-center">
							<p className="text-clay/70">
								Unable to load featured pieces. Please try again later.
							</p>
						</div>
					)}

					{!isLoading && !error && featured.length === 0 && (
						<div className="rounded-lg border border-linen bg-bone p-8 text-center">
							<p className="text-clay/70">New collections arriving soon.</p>
						</div>
					)}

					{!isLoading && !error && featured.length > 0 && (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{featured.map((product, idx) => (
								<motion.div
									key={product._id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-60px' }}
									transition={{ duration: 0.4, delay: idx * 0.08 }}
								>
									<Link
										to={`/product/${product._id}`}
										className="group block overflow-hidden rounded-lg bg-linen shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
									>
										<div className="aspect-square overflow-hidden bg-bone">
											<img
												src={productImageUrl(product)}
												alt={product.name}
												className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading="lazy"
											/>
										</div>
										<div className="p-5">
											<p className="text-xs font-medium uppercase tracking-wider text-moss">
												{product.type}
											</p>
											<h3 className="mt-1 font-[Fraunces] text-lg font-semibold text-clay">
												{product.name}
											</h3>
											<p className="mt-2 text-sm font-medium text-clay/80">
												₪ {product.price.toLocaleString()}
											</p>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					)}

					<div className="mt-8 text-center sm:hidden">
						<Link
							to="/products"
							className="inline-flex items-center gap-2 text-sm font-medium text-clay underline underline-offset-4 transition-colors hover:text-terracotta"
						>
							View all shop items
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			{/* The Atelier */}
			<section className="border-t border-linen bg-linen">
				<div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
					<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
						<div className="space-y-6">
							<p className="text-xs font-semibold uppercase tracking-widest text-moss">
								The Atelier
							</p>
							<h2
								className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
								style={{ letterSpacing: '-0.01em' }}
							>
								The Hand Behind the Bead
							</h2>
							<div className="space-y-4 text-clay/80 leading-relaxed">
								<p>
									Nestled in a quiet alley of old Tel Aviv, MegaBead began as a single workbench and
									a bag of local clay. Today, it remains a slow-craft sanctuary.
								</p>
								<p>
									Our founder believes that the items we wear should be anchors—reminders of the
									earth they came from and the intention with which they were shaped. Each bead is
									rolled by hand, kiln-fired in small batches, and threaded with care.
								</p>
							</div>
							<Link
								to="/products"
								className="inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-terracotta/80"
							>
								Read the full journal
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</Link>
						</div>
						<div className="relative">
							<div className="aspect-[4/3] overflow-hidden rounded-lg bg-bone shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)]">
								<img
									src="/images/assets/about-maker.jpg"
									alt="Young artisan smiling while holding a finished beaded bracelet in her sunlit studio"
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div className="absolute -bottom-4 -right-4 hidden h-20 w-20 rounded-full bg-terracotta/10 lg:block" />
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter */}
			<section className="border-t border-linen bg-bone">
				<div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6 lg:py-24">
					<h2
						className="font-[Fraunces] text-2xl font-semibold text-clay md:text-3xl"
						style={{ letterSpacing: '-0.01em' }}
					>
						Join the Atelier Circle
					</h2>
					<p className="mx-auto mt-4 max-w-lg text-clay/70">
						Quiet stories, new collection drops, and creative rituals delivered once a month.
					</p>
					<form
						onSubmit={handleSubscribe}
						className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
					>
						<label htmlFor="newsletter-email" className="sr-only">
							Email address
						</label>
						<input
							id="newsletter-email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="your@email.com"
							className="flex-1 rounded-sm border border-linen bg-bone px-4 py-3 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
						/>
						<button
							type="submit"
							className="inline-flex items-center justify-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
						>
							Subscribe
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}

export default Home;
