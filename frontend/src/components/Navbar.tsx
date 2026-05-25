import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
	ShoppingBag,
	Wrench,
	User,
	ShoppingCart,
	Settings,
	LogIn,
	LogOut,
	Menu,
	X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserType {
	_id: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	isAdmin?: boolean;
}

interface AuthCtx {
	user: UserType | null;
	logout: () => void;
}

const navLinks = [
	{ to: '/products', label: 'Shop' },
	{ to: '/builder', label: 'Builder' },
];

const authLinks = [
	{ to: '/profile', label: 'Profile' },
	{ to: '/cart', label: 'Cart' },
];

const guestLinks = [
	{ to: '/login', label: 'Login' },
	{ to: '/register', label: 'Register' },
];

function Navbar() {
	const { user, logout } = useContext(AuthContext) as unknown as AuthCtx;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setMobileOpen(false);
		window.location.href = '/';
	};

	const linkBase =
		'text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone rounded-sm';
	const linkInactive = 'text-clay hover:text-terracotta';
	const linkActive = 'text-terracotta';

	return (
		<header className="sticky top-0 z-50 w-full border-b border-linen bg-bone/90 backdrop-blur-sm">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
				{/* Brand */}
				<Link
					to="/"
					className="font-[Fraunces] text-2xl font-semibold text-clay transition-colors hover:text-terracotta"
					style={{ letterSpacing: '-0.02em' }}
					aria-label="MegaBead home"
				>
					MegaBead
				</Link>

				{/* Desktop Nav */}
				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
						>
							{link.label}
						</NavLink>
					))}
					{user?.isAdmin && (
						<NavLink
							to="/manage_products"
							className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
						>
							Manage
						</NavLink>
					)}
					{user ? (
						<>
							{authLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={({ isActive }) =>
										`${linkBase} ${isActive ? linkActive : linkInactive}`
									}
								>
									{link.label}
								</NavLink>
							))}
							<button
								onClick={handleLogout}
								className={`${linkBase} ${linkInactive} flex items-center gap-1.5`}
							>
								<LogOut className="h-4 w-4" aria-hidden="true" />
								Logout
							</button>
						</>
					) : (
						<>
							{guestLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									className={({ isActive }) =>
										`${linkBase} ${isActive ? linkActive : linkInactive}`
									}
								>
									{link.label}
								</NavLink>
							))}
						</>
					)}
				</div>

				{/* Mobile Hamburger */}
				<button
					aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileOpen}
					className="rounded-sm p-2 text-clay transition-colors hover:text-terracotta focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone md:hidden"
					onClick={() => setMobileOpen((v) => !v)}
				>
					{mobileOpen ? (
						<X className="h-6 w-6" aria-hidden="true" />
					) : (
						<Menu className="h-6 w-6" aria-hidden="true" />
					)}
				</button>
			</nav>

			{/* Mobile Sheet Drawer */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: 'easeInOut' }}
						className="overflow-hidden border-b border-linen bg-bone md:hidden"
					>
						<div className="flex flex-col gap-1 px-4 py-6">
							{navLinks.map((link) => (
								<NavLink
									key={link.to}
									to={link.to}
									onClick={() => setMobileOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 rounded-sm px-2 py-2.5 text-base font-medium transition-colors ${
											isActive
												? 'text-terracotta'
												: 'text-clay hover:bg-linen hover:text-terracotta'
										}`
									}
								>
									{link.label === 'Shop' && <ShoppingBag className="h-5 w-5" aria-hidden="true" />}
									{link.label === 'Builder' && <Wrench className="h-5 w-5" aria-hidden="true" />}
									{link.label}
								</NavLink>
							))}
							{user?.isAdmin && (
								<NavLink
									to="/manage_products"
									onClick={() => setMobileOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 rounded-sm px-2 py-2.5 text-base font-medium transition-colors ${
											isActive
												? 'text-terracotta'
												: 'text-clay hover:bg-linen hover:text-terracotta'
										}`
									}
								>
									<Settings className="h-5 w-5" aria-hidden="true" />
									Manage
								</NavLink>
							)}
							{user ? (
								<>
									{authLinks.map((link) => (
										<NavLink
											key={link.to}
											to={link.to}
											onClick={() => setMobileOpen(false)}
											className={({ isActive }) =>
												`flex items-center gap-3 rounded-sm px-2 py-2.5 text-base font-medium transition-colors ${
													isActive
														? 'text-terracotta'
														: 'text-clay hover:bg-linen hover:text-terracotta'
												}`
											}
										>
											{link.label === 'Profile' && <User className="h-5 w-5" aria-hidden="true" />}
											{link.label === 'Cart' && (
												<ShoppingCart className="h-5 w-5" aria-hidden="true" />
											)}
											{link.label}
										</NavLink>
									))}
									<button
										onClick={handleLogout}
										className="flex items-center gap-3 rounded-sm px-2 py-2.5 text-left text-base font-medium text-clay transition-colors hover:bg-linen hover:text-terracotta"
									>
										<LogOut className="h-5 w-5" aria-hidden="true" />
										Logout
									</button>
								</>
							) : (
								<>
									{guestLinks.map((link) => (
										<NavLink
											key={link.to}
											to={link.to}
											onClick={() => setMobileOpen(false)}
											className={({ isActive }) =>
												`flex items-center gap-3 rounded-sm px-2 py-2.5 text-base font-medium transition-colors ${
													isActive
														? 'text-terracotta'
														: 'text-clay hover:bg-linen hover:text-terracotta'
												}`
											}
										>
											{link.label === 'Login' && <LogIn className="h-5 w-5" aria-hidden="true" />}
											{link.label === 'Register' && <User className="h-5 w-5" aria-hidden="true" />}
											{link.label}
										</NavLink>
									))}
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}

export default Navbar;
