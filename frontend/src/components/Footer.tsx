import { Link } from 'react-router-dom';

const exploreLinks = [
	{ to: '/products', label: 'Shop' },
	{ to: '/builder', label: 'Builder' },
];

const studioLinks = [{ to: '/', label: 'About us' }];

function Footer() {
	return (
		<footer className="bg-ink text-bone">
			<div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
				<div className="grid gap-12 md:grid-cols-3">
					{/* Brand + tagline */}
					<div className="space-y-4">
						<Link
							to="/"
							className="inline-block font-[Fraunces] text-2xl font-semibold text-bone transition-colors hover:text-terracotta"
							style={{ letterSpacing: '-0.02em' }}
						>
							MegaBead
						</Link>
						<p className="max-w-xs text-sm leading-relaxed text-bone/80">
							A curated atelier for the modern maker. Crafting timeless pieces from earth&apos;s
							most resilient materials.
						</p>
					</div>

					{/* Links */}
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
						<div className="space-y-4">
							<h3 className="text-xs font-semibold uppercase tracking-widest text-bone/60">
								Explore
							</h3>
							<ul className="space-y-2.5">
								{exploreLinks.map((link) => (
									<li key={link.to}>
										<Link
											to={link.to}
											className="text-sm text-bone/80 transition-colors hover:text-terracotta"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-4">
							<h3 className="text-xs font-semibold uppercase tracking-widest text-bone/60">
								Studio
							</h3>
							<ul className="space-y-2.5">
								{studioLinks.map((link) => (
									<li key={link.to}>
										<Link
											to={link.to}
											className="text-sm text-bone/80 transition-colors hover:text-terracotta"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Contact / Social */}
					<div className="space-y-4">
						<h3 className="text-xs font-semibold uppercase tracking-widest text-bone/60">
							Connect
						</h3>
						<ul className="space-y-2.5">
							<li>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noreferrer noopener"
									className="text-sm text-bone/80 transition-colors hover:text-terracotta"
								>
									Instagram
								</a>
							</li>
							<li>
								<a
									href="mailto:hello@megabead.com"
									className="text-sm text-bone/80 transition-colors hover:text-terracotta"
								>
									Contact Us
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-bone/10">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6 lg:px-8">
					<p className="text-xs text-bone/60">
						&copy; {new Date().getFullYear()} MegaBead Atelier. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<Link to="/" className="text-xs text-bone/60 transition-colors hover:text-bone">
							Privacy Policy
						</Link>
						<Link to="/" className="text-xs text-bone/60 transition-colors hover:text-bone">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
