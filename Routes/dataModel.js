const express = require("express");

const router = express.Router();
const data_model = require('../Controllers/data-model')




router
    .route('/add-data-model')
    .post(data_model.addDataModel)

router
    .route('/')
    .get(data_model.getDataModels)

router
    .route('/:id')
    .put(data_model.updateDataModel)
router
    .route('/:id')
    .delete(data_model.deleteDataModel)


module.exports = router