const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const allRoute = require("./route");

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET, POST, PUT, DELETE",
		credentials: true,
	})
);
app.use(cookieParser());
app.use("/", allRoute);

module.exports = app;
