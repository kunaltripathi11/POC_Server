const express = require('express')
let app = express()
const dataModel = require('./Routes/dataModel')
const buisnessRules = require('./Routes/buisnessRules')
const tags = require('./Routes/tags')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const applicationRoute = require('./Routes/application')
const solutionCategoryRoute = require('./Routes/solutionCategory')
const categoryRoute = require('./Routes/categoryRoute')
const dashboardRoute = require('./Routes/dashboardRoutes')
const widgetRoute = require('./Routes/widgetRoute')


app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use('/admin/data-model', dataModel)
app.use('/admin/business-rules', buisnessRules)
app.use('/admin/tags', tags)
app.use('/admin/application/apps', applicationRoute)
app.use('/admin/application/solution-categories', solutionCategoryRoute)
app.use('/admin/application/categories', categoryRoute)
app.use('/admin/dashboard', dashboardRoute)

app.use('/admin/widget', widgetRoute)

module.exports = app