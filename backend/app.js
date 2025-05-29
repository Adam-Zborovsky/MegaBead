require("dotenv").config();
const express = require("express");
const path = require("path");
const connectToDB = require("./DB/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { loggerMiddleware } = require("./logger/loggerService");
const { handleError } = require("./utils/handleErrors");

const app = express();
const PORT = process.env.PORT || 8181;

connectToDB()
	.then(() => {
		app.use(corsMiddleware);
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(loggerMiddleware());

		app.use(
			"/images",
			express.static(path.join(__dirname, "products/product-images"))
		);

		app.use("/", router);

		app.use((err, req, res, next) => {
			const status = err.status || 500;
			handleError(res, status, err.message || "Internal Server Error");
		});

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("DB connection failed:", err);
		process.exit(1);
	});
