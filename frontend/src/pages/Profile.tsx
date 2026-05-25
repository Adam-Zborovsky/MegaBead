import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../context/AuthContext';
import { updateUser, deleteUserProfile } from '../services/userService';
import { toast } from 'react-toastify';
import AddShippingModal from '../components/AddShippingModal';
import AddPaymentModal from '../components/AddPaymentModal';
import { User, Home, CreditCard, Package, Plus, LogOut, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Address {
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

interface Payment {
	cardHolderName: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
}

interface UserData {
	_id: string;
	name: { first: string; last: string };
	email: string;
	shippingOptions: Address[];
	paymentOptions: Payment[];
	isAdmin?: boolean;
}

type Tab = 'account' | 'addresses' | 'payment' | 'orders';

const accountSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().min(1, 'Email is required').email('Invalid email'),
});

type AccountForm = z.infer<typeof accountSchema>;

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
	{ key: 'account', label: 'Account', icon: User },
	{ key: 'addresses', label: 'Addresses', icon: Home },
	{ key: 'payment', label: 'Payment Methods', icon: CreditCard },
	{ key: 'orders', label: 'Order History', icon: Package },
];

function Profile() {
	useDocumentTitle('Your profile');
	const { user, logout } = useContext(AuthContext) as {
		user: UserData | null;
		logout: () => void;
	};
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<Tab>('account');
	const [showShippingModal, setShowShippingModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AccountForm>({
		resolver: zodResolver(accountSchema),
		values: {
			firstName: user?.name?.first || '',
			lastName: user?.name?.last || '',
			email: user?.email || '',
		},
	});

	const onSave = async (data: AccountForm) => {
		if (!user) return;
		try {
			await updateUser(user._id, {
				name: { first: data.firstName, last: data.lastName },
				email: data.email,
			});
			toast.success('Profile updated successfully!');
		} catch {
			toast.error('Failed to update profile.');
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleDelete = async () => {
		if (!user) return;
		if (!window.confirm('Are you sure you want to delete your account?')) return;
		try {
			await deleteUserProfile();
			toast.success('Account deleted.');
			logout();
			navigate('/');
		} catch {
			toast.error('Failed to delete account.');
		}
	};

	if (!user) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-20 text-center">
				<p className="text-clay/70">Please log in to access your profile.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-bone">
			{/* Header */}
			<section className="border-b border-linen bg-bone">
				<div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
					<h1
						className="font-[Fraunces] text-3xl font-semibold text-clay md:text-4xl"
						style={{ letterSpacing: '-0.01em' }}
					>
						Your Studio Account
					</h1>
					<p className="mt-2 max-w-xl text-clay/70">
						Welcome back to your creative sanctuary. Manage your details, history, and treasures
						here.
					</p>
				</div>
			</section>

			<div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12">
				<div className="grid gap-8 lg:grid-cols-4">
					{/* Sidebar tabs */}
					<nav className="flex flex-col gap-1 lg:col-span-1">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.key;
							return (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									className={`flex items-center gap-3 rounded-sm px-4 py-3 text-left text-sm font-medium transition-colors ${
										isActive
											? 'bg-linen text-terracotta'
											: 'text-clay hover:bg-linen hover:text-terracotta'
									}`}
								>
									<Icon className="h-4 w-4" aria-hidden="true" />
									{tab.label}
								</button>
							);
						})}
						<div className="my-2 border-t border-linen" />
						<button
							onClick={handleLogout}
							className="flex items-center gap-3 rounded-sm px-4 py-3 text-left text-sm font-medium text-clay transition-colors hover:bg-linen hover:text-terracotta"
						>
							<LogOut className="h-4 w-4" aria-hidden="true" />
							Log out
						</button>
					</nav>

					{/* Content */}
					<div className="lg:col-span-3">
						{activeTab === 'account' && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<h2 className="font-[Fraunces] text-xl font-semibold text-clay">
									Personal Details
								</h2>
								<form onSubmit={handleSubmit(onSave)} className="mt-6 max-w-lg space-y-5">
									<div className="grid gap-5 sm:grid-cols-2">
										<div>
											<label
												htmlFor="firstName"
												className="mb-1.5 block text-sm font-medium text-clay"
											>
												First name
											</label>
											<input
												id="firstName"
												type="text"
												{...register('firstName')}
												className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
											/>
											{errors.firstName && (
												<p className="mt-1 text-xs text-terracotta">{errors.firstName.message}</p>
											)}
										</div>
										<div>
											<label
												htmlFor="lastName"
												className="mb-1.5 block text-sm font-medium text-clay"
											>
												Last name
											</label>
											<input
												id="lastName"
												type="text"
												{...register('lastName')}
												className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
											/>
											{errors.lastName && (
												<p className="mt-1 text-xs text-terracotta">{errors.lastName.message}</p>
											)}
										</div>
									</div>

									<div>
										<label htmlFor="email" className="mb-1.5 block text-sm font-medium text-clay">
											Email address
										</label>
										<input
											id="email"
											type="email"
											{...register('email')}
											className="w-full rounded-sm border border-linen bg-bone px-4 py-2.5 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
										/>
										{errors.email && (
											<p className="mt-1 text-xs text-terracotta">{errors.email.message}</p>
										)}
									</div>

									<div className="flex flex-wrap items-center gap-3 pt-2">
										<button
											type="submit"
											disabled={isSubmitting}
											className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 disabled:opacity-60"
										>
											{isSubmitting ? 'Saving...' : 'Save changes'}
										</button>
										<button
											type="button"
											onClick={handleDelete}
											className="inline-flex items-center gap-2 rounded-sm border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
										>
											<Trash2 className="h-4 w-4" aria-hidden="true" />
											Delete account
										</button>
									</div>
								</form>
							</motion.div>
						)}

						{activeTab === 'addresses' && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex items-center justify-between">
									<h2 className="font-[Fraunces] text-xl font-semibold text-clay">Addresses</h2>
									<button
										onClick={() => setShowShippingModal(true)}
										className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
									>
										<Plus className="h-4 w-4" aria-hidden="true" />
										Add new address
									</button>
								</div>

								<div className="mt-6 space-y-4">
									{user.shippingOptions?.length > 0 ? (
										user.shippingOptions.map((addr, idx) => (
											<div
												key={idx}
												className="flex items-start justify-between rounded-lg border border-linen bg-bone p-5"
											>
												<div className="flex items-start gap-3">
													<Home className="mt-0.5 h-5 w-5 text-moss" aria-hidden="true" />
													<div>
														<p className="text-sm font-medium text-clay">
															{addr.addressLine1}
															{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
														</p>
														<p className="text-sm text-clay/70">
															{addr.city}, {addr.state} {addr.postalCode}
														</p>
														<p className="text-sm text-clay/70">{addr.country}</p>
													</div>
												</div>
											</div>
										))
									) : (
										<div className="rounded-lg border border-linen bg-bone p-8 text-center">
											<p className="text-clay/70">No saved addresses yet.</p>
										</div>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === 'payment' && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex items-center justify-between">
									<h2 className="font-[Fraunces] text-xl font-semibold text-clay">
										Payment Methods
									</h2>
									<button
										onClick={() => setShowPaymentModal(true)}
										className="inline-flex items-center gap-2 rounded-sm bg-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
									>
										<Plus className="h-4 w-4" aria-hidden="true" />
										Add payment method
									</button>
								</div>

								<div className="mt-6 space-y-4">
									{user.paymentOptions?.length > 0 ? (
										user.paymentOptions.map((card, idx) => (
											<div
												key={idx}
												className="flex items-start justify-between rounded-lg border border-linen bg-bone p-5"
											>
												<div className="flex items-start gap-3">
													<CreditCard className="mt-0.5 h-5 w-5 text-moss" aria-hidden="true" />
													<div>
														<p className="text-sm font-medium text-clay">{card.cardHolderName}</p>
														<p className="text-sm text-clay/70">
															•••• •••• •••• {card.cardNumber.slice(-4)}
														</p>
														<p className="text-sm text-clay/70">
															Expires {card.expiryMonth}/{card.expiryYear}
														</p>
													</div>
												</div>
											</div>
										))
									) : (
										<div className="rounded-lg border border-linen bg-bone p-8 text-center">
											<p className="text-clay/70">No saved payment methods yet.</p>
										</div>
									)}
								</div>
							</motion.div>
						)}

						{activeTab === 'orders' && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="flex flex-col items-center justify-center rounded-lg border border-linen bg-bone p-12 text-center"
							>
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-linen text-moss">
									<Package className="h-6 w-6" aria-hidden="true" />
								</div>
								<h2 className="font-[Fraunces] text-xl font-semibold text-clay">
									Your Journey Awaits
								</h2>
								<p className="mx-auto mt-2 max-w-md text-sm text-clay/70">
									Your journey with us will appear here soon. Once you&apos;ve selected your first
									handcrafted treasure, you&apos;ll be able to track its progress here.
								</p>
								<Link
									to="/products"
									className="mt-6 inline-flex items-center gap-2 rounded-sm bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
								>
									Explore collections
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</Link>
							</motion.div>
						)}
					</div>
				</div>
			</div>

			{showShippingModal && <AddShippingModal onClose={() => setShowShippingModal(false)} />}
			{showPaymentModal && (
				<AddPaymentModal onClose={() => setShowPaymentModal(false)} onSubmit={() => {}} />
			)}
		</div>
	);
}

export default Profile;
