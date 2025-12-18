const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: Number(process.env.EMAIL_PORT),
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error("SMTP connection error:", error);
	} else {
		console.log("SMTP server is ready to send emails");
	}
});

module.exports = transporter;
