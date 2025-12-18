const express = require("express");
const router = express.Router();

const authRoute = require("./Routes/AuthRoutes/authRoute");
const adminRoute = require("./Routes/adminRoute");
const { verifyToken } = require("./Middleware/auth");

router.use("/", authRoute);

router.use(verifyToken);

router.use("/admin", adminRoute);

module.exports = router;
