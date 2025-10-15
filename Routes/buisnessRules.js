const express = require("express");

const router = express.Router();
const buisnessRules = require('../Controllers/buisness-rules')


router
    .route('/add-business-rules')
    .post(buisnessRules.addBuisnessRules)

router
    .route('/')
    .get(buisnessRules.getBusinessRules)

router
    .route('/archive')
    .get(buisnessRules.getDeletedBusinessRules)

router
    .route('/oneRule')
    .get(buisnessRules.getBusinessRulesById)

router
    .route('/:id')
    .put(buisnessRules.updateBusinessRule)
    .delete(buisnessRules.deleteBusinessRules)

module.exports = router

