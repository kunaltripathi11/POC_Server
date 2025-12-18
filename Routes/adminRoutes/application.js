const express = require("express");

const router = express.Router();
const applicationController = require("../../Controllers/applicationController");

router.route("/add-app").post(applicationController.addApplication);

router.route("/").get(applicationController.getApplication);

router
	.route("/edit/:id")
	.put(applicationController.updateApplication)
	.delete(applicationController.deleteApplication);

module.exports = router;
