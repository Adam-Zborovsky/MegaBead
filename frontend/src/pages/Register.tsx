import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const registerSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required'),
		email: z.string().min(1, 'Email is required').email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
	useDocumentTitle('Create account');
	const { login } = useContext(AuthContext) as {
		login: (token: string) => Promise<void>;
	};
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		try {
			await registerUser({
				name: { first: data.firstName, last: data.lastName },
				email: data.email,
				password: data.password,
			});
			const loginRes = await loginUser(data.email, data.password);
			await login(loginRes.data.token);
			navigate('/');
		} catch {
			// Error handled by AuthContext toast or service
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] bg-bone">
			{/* Left: Brand visual */}
			<div className="relative hidden w-1/2 overflow-hidden lg:block">
				<img
					src="/images/assets/young-maker.jpg"
					alt="Young jewelry maker working with beads in a sunlit studio"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-ink/40" />
				<div className="absolute inset-0 flex flex-col justify-end p-12">
					<p className="font-[Fraunces] text-3xl font-medium text-bone">
						Every piece begins with a story.
					</p>
					<p className="mt-2 text-bone/80">Start yours.</p>
				</div>
			</div>

			{/* Right: Form */}
			<div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 lg:px-16">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="w-full max-w-md"
				>
					<p className="text-xs font-semibold uppercase tracking-widest text-terracotta">
						Join the atelier
					</p>
					<h1
						className="mt-2 font-[Fraunces] text-3xl font-semibold text-clay"
						style={{ letterSpacing: '-0.01em' }}
					>
						Create your account
					</h1>
					<p className="mt-2 text-sm text-clay/70">
						Save your favorites and track your hand-crafted orders.
					</p>

					<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
						<div className="grid gap-5 sm:grid-cols-2">
							<div>
								<label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-clay">
									First name
								</label>
								<div className="relative">
									<User
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
										aria-hidden="true"
									/>
									<input
										id="firstName"
										type="text"
										autoComplete="given-name"
										{...register('firstName')}
										className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
										placeholder="Jane"
									/>
								</div>
								{errors.firstName && (
									<p className="mt-1 text-xs text-terracotta">{errors.firstName.message}</p>
								)}
							</div>

							<div>
								<label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-clay">
									Last name
								</label>
								<div className="relative">
									<User
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
										aria-hidden="true"
									/>
									<input
										id="lastName"
										type="text"
										autoComplete="family-name"
										{...register('lastName')}
										className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
										placeholder="Doe"
									/>
								</div>
								{errors.lastName && (
									<p className="mt-1 text-xs text-terracotta">{errors.lastName.message}</p>
								)}
							</div>
						</div>

						<div>
							<label htmlFor="email" className="mb-1.5 block text-sm font-medium text-clay">
								Email address
							</label>
							<div className="relative">
								<Mail
									className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
									aria-hidden="true"
								/>
								<input
									id="email"
									type="email"
									autoComplete="email"
									{...register('email')}
									className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									placeholder="you@example.com"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-xs text-terracotta">{errors.email.message}</p>
							)}
						</div>

						<div>
							<label htmlFor="password" className="mb-1.5 block text-sm font-medium text-clay">
								Password
							</label>
							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
									aria-hidden="true"
								/>
								<input
									id="password"
									type="password"
									autoComplete="new-password"
									{...register('password')}
									className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									placeholder="••••••••"
								/>
							</div>
							{errors.password && (
								<p className="mt-1 text-xs text-terracotta">{errors.password.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="mb-1.5 block text-sm font-medium text-clay"
							>
								Confirm password
							</label>
							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay/40"
									aria-hidden="true"
								/>
								<input
									id="confirmPassword"
									type="password"
									autoComplete="new-password"
									{...register('confirmPassword')}
									className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									placeholder="••••••••"
								/>
							</div>
							{errors.confirmPassword && (
								<p className="mt-1 text-xs text-terracotta">{errors.confirmPassword.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:opacity-60"
						>
							{isSubmitting ? 'Creating account...' : 'Create account'}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-clay/70">
						Already have an account?{' '}
						<Link
							to="/login"
							className="font-medium text-terracotta underline underline-offset-4 transition-colors hover:text-terracotta/80"
						>
							Sign in
						</Link>
					</p>
				</motion.div>
			</div>
		</div>
	);
}

export default Register;
