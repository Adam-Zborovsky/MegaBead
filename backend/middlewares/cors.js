const cors = require("cors");

const corsMiddleware = cors({
	origin: [
		"https://megabead.adamzborovsky.com",
		"http://localhost:3000",
		"http://localhost:5173",
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
});
module.exports = corsMiddleware;
