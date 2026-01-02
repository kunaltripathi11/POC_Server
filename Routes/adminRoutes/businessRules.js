const express = require("express");

const router = express.Router();
const businessRules = require("../../Controllers/business-rules");

router.route("/add-business-rules").post(businessRules.addbusinessRules);

router.route("/").get(businessRules.getBusinessRules);

router.route("/archive").get(businessRules.getDeletedBusinessRules);
router.route("/archive/:id").delete(businessRules.archiveBusinessRules);

router.route("/activate/:id").put(businessRules.activateRule);

router
	.route("/:id")
	.put(businessRules.updateBusinessRule)
	.delete(businessRules.deleteBusinessRule)
	.get(businessRules.getBusinessRulesById);

module.exports = router;
