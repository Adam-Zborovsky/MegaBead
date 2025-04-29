function Login() {
	return (
		<div className="container py-4">
			<div className="row justify-content-center ">
				<div className="col-md-6 window">
					<h2 className="mb-4 text-primary">Login</h2>
					<form>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control"
								placeholder="you@example.com"
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								placeholder="••••••••"
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100">
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
export default Login;
