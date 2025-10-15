const express = require('express')
const router = express.Router();

const solutionCategoryController = require('../Controllers/solutionCategoryController')

router
    .route('/')
    .get(solutionCategoryController.getSolCategory)

router
    .route('/:id')
    .put(solutionCategoryController.updateSolCategory)
    .delete(solutionCategoryController.deleteSolCategory)

router
    .route('/add')
    .post(solutionCategoryController.addSolCategory)

module.exports = router