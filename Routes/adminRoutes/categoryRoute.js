const express = require("express");
const router = express.Router();

const categoryController = require("../../Controllers/categoryController");

router.route("/").get(categoryController.getCategory);

router
	.route("/:id")
	.put(categoryController.updateCategory)
	.delete(categoryController.deleteCategory);

router.route("/add").post(categoryController.addCategory);

module.exports = router;
