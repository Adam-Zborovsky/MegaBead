const { handleError } = require("../utils/handleErrors");
const { verifyToken } = require("./providers/jwt");

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token) {
		return handleError(res, 401, "No authentication token, access denied");
	}

	const user = verifyToken(token);
	if (!user) {
		return handleError(res, 401, "Invalid or expired token");
	}

	req.user = user;
	next();
};

module.exports = auth;
