const express = require("express");
const router = express.Router();
const dataModel = require("./adminRoutes/dataModel");
const businessRules = require("./adminRoutes/businessRules");
const tags = require("./adminRoutes/tags");
const applicationRoute = require("./adminRoutes/application");
const solutionCategoryRoute = require("./adminRoutes/solutionCategory");
const categoryRoute = require("./adminRoutes/categoryRoute");
const dashboardRoute = require("./adminRoutes/dashboardRoutes");
const widgetRoute = require("./adminRoutes/widgetRoute");

router.use("/data-model", dataModel);
router.use("/business-rules", businessRules);
router.use("/tags", tags);
router.use("/application/apps", applicationRoute);
router.use("/application/solution-categories", solutionCategoryRoute);
router.use("/application/categories", categoryRoute);
router.use("/dashboard", dashboardRoute);
router.use("/widget", widgetRoute);

module.exports = router;
