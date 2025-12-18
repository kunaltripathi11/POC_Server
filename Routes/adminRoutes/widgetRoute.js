const express = require("express");
const router = express.Router();

const widgetController = require("../../Controllers/widgetsController");

router.route("/").get(widgetController.getWidget);

router
	.route("/:id")
	.put(widgetController.updateWidget)
	.delete(widgetController.deleteWidget);

router.route("/add").post(widgetController.addWidget);

router.route("/getModel").post(widgetController.getModelByRule);

module.exports = router;
