const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authValidation = require("../utils/authValidation");
const transporter = require("../utils/email");
const { generateResetToken } = require("../utils/resetToken");

exports.createUser = async (req, res) => {
	try {
		const { email, name, password, role } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Required fields missing" });
		}

		if (!authValidation.validateName(name)) {
			return res.status(400).json({ message: "Enter Correct name" });
		}
		if (!authValidation.validateEmail(email)) {
			return res.status(400).json({ message: "Enter Correct Email" });
		}
		if (!authValidation.validatePassword(password)) {
			return res
				.status(400)
				.json({ message: "Enter Password in Correct format" });
		}

		const username =
			name.split(" ")[0][0].toLowerCase() +
			name.split(" ")[1].toLowerCase() +
			"@" +
			role.toLowerCase();

		const userExists = await pool.query(
			"SELECT id FROM users WHERE email = $1 OR username = $2",
			[email, username]
		);

		if (userExists.rows.length > 0) {
			return res.status(409).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await pool.query(
			`INSERT INTO users (username, email, name, password, role)
		   VALUES ($1, $2, $3, $4, $5)
		   RETURNING id,uuid, username, email, role`,
			[username, email, name, hashedPassword, role || "user"]
		);

		res.status(201).json({
			message: "User created successfully",
			user: newUser.rows[0],
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		const result = await pool.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);

		if (result.rows.length === 0) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const user = result.rows[0];

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{
				id: user.uuid,
				role: user.role,
				name: user.name,
				username: user.username,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
		res.cookie("token", token, {
			httpOnly: true,
			sameSite: "lax",
			maxAge: Number(process.env.LOGIN_MAX_AGE),
			secure: false,
		});
		res.json({
			message: "Login Successful",
			user: {
				id: user.uuid,
				email: user.email,
				role: user.role,
				name: user.name,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
		console.log(error);
	}
};

exports.logoutUser = (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logged out successfully" });
};

exports.changePassword = async (req, res) => {
	try {
		const { oldPassword, newPassword } = req.body;

		const userId = req.user.id;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				message: "Old password and new password are required",
			});
		}

		const result = await pool.query("SELECT * FROM users WHERE uuid = $1", [
			userId,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		if (result.rows[0].last_password_changed) {
			const password_changed_at = new Date(
				result.rows[0].last_password_changed
			);

			const now = new Date();

			const diffInHours = (now - password_changed_at) / (1000 * 60);

			if (diffInHours < 5) {
				return res.status(429).json({
					message:
						"Password can only be changed once every 5 Minutes",
				});
			}
		}
		const currPassword = result.rows[0].password;
		const isMatch = await bcrypt.compare(oldPassword, currPassword);
		if (!isMatch) {
			return res
				.status(401)
				.json({ message: "Old password is incorrect" });
		}

		const isSameAsOld = await bcrypt.compare(newPassword, currPassword);
		if (isSameAsOld) {
			return res.status(400).json({
				message: "New password must be different from old password",
			});
		}
		if (!authValidation.validatePassword(newPassword)) {
			return res.status(400).json({
				message: "New password does not meet security requirements",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		await pool.query(
			"UPDATE users SET password = $1, last_password_changed=now() WHERE uuid = $2",
			[hashedPassword, userId]
		);
		res.clearCookie("token");
		res.json({
			success: true,
			message: "Password updated successfully. Please login again.",
		});
	} catch (error) {
		console.error("Change password error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email || !authValidation.validateEmail(email)) {
			return res.status(400).json({ message: "Valid email required" });
		}

		const result = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);

		if (result.rows.length === 0) {
			return res.json({
				message: "If the email exists, a reset link has been sent",
			});
		}
		if (result.rows[0].last_password_changed) {
			const password_changed_at = new Date(
				result.rows[0].last_password_changed
			);

			const now = new Date();

			const diffInHours = (now - password_changed_at) / (1000 * 60);

			if (diffInHours < 5) {
				return res.status(429).json({
					message:
						"Password can only be changed once every 5 Minutes",
				});
			}
		}
		let expiry = new Date(result.rows[0].reset_token_expiry);
		if (expiry > new Date(Date.now())) {
			const time = Math.ceil(
				(expiry - new Date(Date.now())) / (1000 * 60)
			);
			return res.status(429).json({
				message: `Yon can sent another request in around ${time} minutes`,
			});
		}
		const resetToken = generateResetToken();
		expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

		await pool.query(
			`UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3`,
			[resetToken, expiry, email]
		);

		const resetLink = `To change your password chick here ${process.env.FRONTEND_URL}/reset_password?token=${resetToken}`;

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Reset Your Password",
			text: resetLink,
		});

		res.json({
			message: "If the email exists, a reset link has been sent",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { newPassword, token } = req.body;
		if (!token || !newPassword) {
			return res.status(400).json({
				message: "Token and new password are required",
			});
		}

		if (!authValidation.validatePassword(newPassword)) {
			return res.status(400).json({
				message: "Password does not meet security requirements",
			});
		}

		const result = await pool.query(
			`SELECT uuid, password,reset_token_expiry FROM users WHERE reset_token = $1 `,
			[token]
		);
		if (result.rows.length === 0) {
			return res.status(400).json({
				message: "Invalid reset token",
			});
		} else if (new Date(result.rows[0].reset_token_expiry) < new Date()) {
			return res.status(400).json({
				message: "Expired reset token, Please regenrate the reset link",
			});
		}

		const { uuid, password: oldHashedPassword } = result.rows[0];

		const isSame = await bcrypt.compare(newPassword, oldHashedPassword);
		if (isSame) {
			return res.status(400).json({
				message: "New password must be different from old password",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);
		await pool.query(
			`UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL, last_password_changed = NOW() WHERE uuid = $2`,
			[hashedPassword, uuid]
		);

		res.clearCookie("token");

		res.json({
			message: "Password reset successful. Please login again.",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

exports.getUser = async (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
};
