const express = require("express");

const router = express.Router();
const tags = require("../../Controllers/tags");

router.route("/add-tag").post(tags.addTag);

router.route("/get-tag").post(tags.getTag);

module.exports = router;
