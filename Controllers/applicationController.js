const pool = require('../db')

let userID = 'c0f715b5-9800-41a5-80df-69e73767765b'
exports.addApplication = async (req, res) => {

    const {
        title,
        category_id,
        display_order,
        app_package,
        icon,
        active,
        hide_app
    } = req.body

    const created_by_id = userID
    const updated_by_id = userID
    const addAppQuery = "INSERT INTO application ( title,category_id,display_order, app_package,icon, active, hide_app,created_by_id, updated_by_id ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *"
    try {

        const result = await pool.query(addAppQuery, [title, category_id || null, display_order, app_package, icon || null, active || true, hide_app || false, created_by_id, updated_by_id])

        res.status(201).json({
            Message: "Inserted Sucessfully",
            data: result.rows
        })
    } catch (error) {
        console.log("ERROR");
        console.log(error);
        res.status(500).json("Error in adding")
    }
}

exports.getApplication = async (req, res) => {
    const getAppQuery = "Select a.id,a.title , c.category_name ,a.display_order, a.app_package,a.icon, a.active, a.hide_app FROM application a LEFT JOIN category c ON a.category_id=c.id WHERE a.is_deleted=FALSE ORDER BY display_order,title"
    try {
        const result = await pool.query(getAppQuery)
        res.status(200).json({
            Message: "Data fetched",
            data: result.rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Error Fetching")
    }



}


exports.deleteApplication = async (req, res) => {

    const deleteAppQuery = "UPDATE application SET is_deleted=true, updated_at=NOW(), updated_by_id=$1 WHERE uuid=$2 returning *"
    const updated_by_id = userID
    try {
        const result = await pool.query(deleteAppQuery, [updated_by_id, req.params.id])
        res.status(200).json({
            Message: "Data Deleting",
            data: result.rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Error Deleting")
    }
}


exports.updateApplication = async (req, res) => {

    const {
        title,
        category_id,
        display_order,
        app_package,
        icon,
        active,
        hide_app
    } = req.body

    const updateAppQuery = "UPDATE application SET title=$1,category_id=$2,display_order=$3, app_package=$4,icon=$5, active=$6, hide_app=$7, updated_at=NOW(), updated_by_id=$8 WHERE (uuid=$9 and is_deleted=FALSE) returning *"
    const updated_by_id = userID
    try {
        const result = await pool.query(updateAppQuery, [title, category_id || null, display_order, app_package, icon || null, active || true, hide_app || false, updated_by_id, req.params.id])
        res.status(200).json({
            Message: "Data Updating",
            data: result.rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Error Updating")
    }
}