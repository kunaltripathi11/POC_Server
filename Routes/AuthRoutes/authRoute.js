const express = require("express");

const router = express.Router();

const authController = require("../../Controllers/authController");

const { verifyToken, authorizeRoles } = require("../../Middleware/auth");

router
	.route("/create")
	.post(verifyToken, authorizeRoles("Admin"), authController.createUser);

router.route("/login").post(authController.loginUser);
router.route("/logout").post(authController.logoutUser);
router
	.route("/change-password")
	.put(verifyToken, authController.changePassword);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);

router.route("/me").get(verifyToken, authController.getUser);

module.exports = router;
