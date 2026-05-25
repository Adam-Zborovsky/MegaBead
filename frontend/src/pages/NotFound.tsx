import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
	{
		to: '/products',
		label: 'The Earth Collection',
		sub: 'Explore Raw Textures',
		icon: Leaf,
	},
	{
		to: '/products',
		label: 'New Arrivals',
		sub: 'Freshly Handcrafted',
		icon: Sparkles,
	},
	{
		to: '/',
		label: 'The Journal',
		sub: 'Stories from the Atelier',
		icon: BookOpen,
	},
];

function NotFound() {
	useDocumentTitle('Page not found');
	return (
		<div className="min-h-screen bg-bone">
			<section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6 lg:px-8 lg:py-28">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1
						className="font-[Fraunces] text-8xl font-semibold text-clay md:text-9xl"
						style={{ letterSpacing: '-0.04em' }}
					>
						404
					</h1>
					<p className="mx-auto mt-4 max-w-lg text-lg text-clay/80">
						We couldn&apos;t find that page. It seems this path has led to a quiet corner of our
						studio. Let us guide you back to our collections.
					</p>
					<Link
						to="/"
						className="mt-8 inline-flex items-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
					>
						Go home
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
				</motion.div>

				<div className="mt-16 grid gap-6 sm:grid-cols-3">
					{links.map((link, idx) => {
						const Icon = link.icon;
						return (
							<motion.div
								key={link.label}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
							>
								<Link
									to={link.to}
									className="group flex flex-col items-center rounded-lg border border-linen bg-bone p-8 text-center shadow-[0_1px_3px_rgba(26,22,18,0.08),0_4px_12px_rgba(26,22,18,0.05)] transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,18,0.12)]"
								>
									<Icon
										className="h-8 w-8 text-terracotta transition-colors group-hover:text-moss"
										aria-hidden="true"
									/>
									<h3 className="mt-4 font-[Fraunces] text-lg font-semibold text-clay">
										{link.label}
									</h3>
									<p className="mt-1 text-sm text-clay/70">{link.sub}</p>
								</Link>
							</motion.div>
						);
					})}
				</div>
			</section>
		</div>
	);
}

export default NotFound;
