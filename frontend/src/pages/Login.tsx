import { useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const loginSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
	useDocumentTitle('Sign in');
	const { login } = useContext(AuthContext) as {
		login: (token: string) => Promise<void>;
	};
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const next = searchParams.get('next') || '/';

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			const res = await loginUser(data.email, data.password);
			await login(res.data.token);
			navigate(next);
		} catch {
			// Error handled by AuthContext toast
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] bg-bone">
			{/* Left: Brand visual */}
			<div className="relative hidden w-1/2 overflow-hidden lg:block">
				<img
					src="/images/assets/login-hands.jpg"
					alt="Close-up of hands threading ceramic beads onto silk cord"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-ink/40" />
				<div className="absolute inset-0 flex flex-col justify-end p-12">
					<p className="font-[Fraunces] text-3xl font-medium text-bone">
						Every bead tells a story.
					</p>
					<p className="mt-2 text-bone/80">Every piece is crafted with pure intention.</p>
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
						Welcome back
					</p>
					<h1
						className="mt-2 font-[Fraunces] text-3xl font-semibold text-clay"
						style={{ letterSpacing: '-0.01em' }}
					>
						Sign in to your curator account
					</h1>

					<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
									autoComplete="current-password"
									{...register('password')}
									className="w-full rounded-sm border border-linen bg-bone py-2.5 pl-10 pr-4 text-sm text-clay placeholder:text-clay/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
									placeholder="••••••••"
								/>
							</div>
							{errors.password && (
								<p className="mt-1 text-xs text-terracotta">{errors.password.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-terracotta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:opacity-60"
						>
							{isSubmitting ? 'Signing in...' : 'Sign in'}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-clay/70">
						Don&apos;t have an account?{' '}
						<Link
							to="/register"
							className="font-medium text-terracotta underline underline-offset-4 transition-colors hover:text-terracotta/80"
						>
							Register
						</Link>
					</p>
				</motion.div>
			</div>
		</div>
	);
}

export default Login;
