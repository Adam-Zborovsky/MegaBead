const cors = require("cors");

const corsMiddleware = cors({
	origin: [
		...(process.env.ALLOWED_ORIGINS
			? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
			: []),
		"http://localhost:3000",
		"http://localhost:5173",
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
});
module.exports = corsMiddleware;
