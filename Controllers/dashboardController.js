
const pool = require('../db')
let userID = 'c0f715b5-9800-41a5-80df-69e73767765b'


const addAppQuery = "INSERT INTO application ( title,display_order, app_package,icon,created_by_id, updated_by_id ) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,app_package "
exports.addDashboard = async (req, res) => {

    let {
        name,
        title,
        app_id,
        url,
        remove_filter,
        app_package,
        createApp,
        app_title,
        iconName,
        display_order
    } = req.body

    const created_by_id = userID
    const updated_by_id = userID
    const checkuUnique = await pool.query("SELECT * FROM dashboard WHERE name=$1 or url=$2 ", [name, url])

    if (checkuUnique.rows.length > 0) {
        res.status(501).json({
            Message: "Url or name is not unique"

        })
        return
    }

    const addDashboardQuery = "INSERT INTO dashboard (name,title,app_id,url,remove_filter,app_package, created_by_id, updated_by_id) VALUES($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *"

    try {
        if (createApp == true) {


            const result = await pool.query(addAppQuery, [app_title, display_order, app_package, iconName || null, created_by_id, updated_by_id])

            app_package = result.rows[0].app_package
            app_id = result.rows[0].id
        }



        const result = await pool.query(addDashboardQuery, [name, title, app_id, url, remove_filter || false, app_package, created_by_id, updated_by_id])
        res.status(200).json("Dashboard Inserted sucessfully")

    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR INSERTING")
    }

}

exports.updateDashboard = async (req, res) => {

    let {
        name,
        title,
        app_id,
        url,
        remove_filter,
        app_package,
        createApp,
        app_title,
        iconName,
        display_order
    } = req.body

    const created_by_id = userID
    const updated_by_id = userID
    const checkuUnique = await pool.query("SELECT * FROM dashboard WHERE name=$1 or url=$2 ", [name, url])

    if (checkuUnique.rows.length > 1) {
        res.status(501).json({
            Message: "Url or name is not unique"

        })
        return
    }

    const updateDashboardQuery = "UPDATE dashboard SET name=$1,title=$2,app_id=$3,url=$4,remove_filter=$5,app_package=$6, created_by_id=$7, updated_by_id=$8 WHERE uuid=$9 and is_deleted =FALSE RETURNING *"

    try {
        if (createApp == true) {

            const result = await pool.query(addAppQuery, [app_title, display_order, app_package, iconName || null, created_by_id, updated_by_id])

            app_package = result.rows[0].app_package
            app_id = result.rows[0].id
        }



        const result = await pool.query(updateDashboardQuery, [name, title, app_id, url, remove_filter || false, app_package, created_by_id, updated_by_id, req.params.id])
        res.status(200).json("Dashboard Updated sucessfully",

            {
                data: result.rows
            }
        )

    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR Updating")
    }

}

exports.getDashboard = async (req, res) => {
    const getDashboard = "SELECT d.title, a.title as Application  ,d.url,d.updated_at from dashboard d join application a on d.app_id=a.id WHERE d.is_deleted=FALSE"

    try {
        const result = await pool.query(getDashboard)
        res.status(200).json({
            data: result.rows
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR FETCHING")
    }
}

exports.deleteDashboard = async (req, res) => {
    const deleteDashboard = "UPDATE dashboard SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1 WHERE uuid=$2 and is_deleted=false RETURNING * "
    const updated_by_id = userID
    try {
        const result = await pool.query(deleteDashboard, [updated_by_id, req.params.id])
        res.status(200).json({
            Message: "Deleted Successfully",
            data: result.rows
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR DELETING")
    }
}

