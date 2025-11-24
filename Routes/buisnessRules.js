const express = require("express");

const router = express.Router();
const buisnessRules = require("../Controllers/buisness-rules");

router.route("/add-business-rules").post(buisnessRules.addBuisnessRules);

router.route("/").get(buisnessRules.getBusinessRules);

router.route("/archive").get(buisnessRules.getDeletedBusinessRules);

router
	.route("/:id")
	.put(buisnessRules.updateBusinessRule)
	.delete(buisnessRules.deleteBusinessRules)
	.get(buisnessRules.getBusinessRulesById);

module.exports = router;
