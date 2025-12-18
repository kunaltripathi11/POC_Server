exports.validateEmail = (email) => {
	if (!email) {
		return false;
	}
	const emailRegex =
		/^[A-Za-z][^\s@!#$%^&*()|]+@[^\s@!#$%^&*()|]+\.[^\s@!#$%^&*()|\d]+$/;
	return emailRegex.test(email);
};

exports.validatePassword = (password) => {
	if (!password) {
		return false;
	}
	if (password.length < 8) return false;

	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSpecial = /[@$!%*?#&]/.test(password);

	return hasLowercase && hasUppercase && hasDigit && hasSpecial;
};

exports.validateName = (name) => {
	console.log(name);
	if (!name.trim()) {
		return false;
	}
	if (!/^[a-zA-Z ]+$/.test(name)) return false;

	const nameSplit = name.trim().split(" ");
	if (nameSplit.length < 2) {
		console.log("LENgth");
		return false;
	}
	for (let i of nameSplit) {
		if (i.length < 2) {
			console.log("i", i);
			return false;
		}
	}
	return true;
};
