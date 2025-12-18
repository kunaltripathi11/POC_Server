const express = require("express");
const router = express.Router();

const dashboardController = require("../../Controllers/dashboardController");

router.route("/").get(dashboardController.getDashboard);

router
	.route("/fetchApps")
	.get(dashboardController.fetchApplicationWithNoDashboard);

router
	.route("/:id")
	.put(dashboardController.updateDashboard)
	.delete(dashboardController.deleteDashboard)
	.get(dashboardController.getDashboardById);

router.route("/add").post(dashboardController.addDashboard);

module.exports = router;
