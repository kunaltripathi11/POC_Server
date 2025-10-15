
const pool = require('../db')
let userID = 'c0f715b5-9800-41a5-80df-69e73767765b'

exports.addWidget = async (req, res) => {
    const { dashboard_id } = req.body

    const addWidgetQuery = "INSERT INTO widget (dashboard_id,created_by_id,updated_by_id) VALUES ($1,$2,$3) RETURNING *"
    const created_by_id = userID
    const updated_by_id = userID

    try {
        const result = await pool.query(addWidgetQuery, [dashboard_id, created_by_id, updated_by_id])
        res.status(200).json("Widget Inserted sucessfully", result.rows)


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR INSERTING")
    }


}

exports.updateWidget = async (req, res) => {

    const { name, dashboard_id, business_rule_id } = req.body

    const getDataModelId = "SELECT data_model_id FROM  business_rules  WHERE id=$1"
    const ModelId = await pool.query(getDataModelId, [business_rule_id])
    const data_model_id = ModelId.rows[0].data_model_id

    const addCatQuery = "UPDATE widget SET name=$1,dashboard_id=$2,business_rule_id=$3,data_model_id=$4,updated_by_id=$5, updated_at=NOW() WHERE uuid=$6 and is_deleted=false returning *"

    const updated_by_id = userID
    try {
        const result = await pool.query(addCatQuery, [name, dashboard_id, business_rule_id, data_model_id, updated_by_id, req.params.id])
        // console.log(result);
        res.status(200).json({
            Message: "Widget Updated sucessfully",
            data: result.rows
        }
        )

    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR UPDATING")
    }


}

exports.getWidget = async (req, res) => {
    const getWidgetData = await pool.query("SELECT d.query FROM widget w join data_model d on d.id=w.data_model_id LIMIT 1")
    const query = getWidgetData.rows[0].query
    try {
        const result = await pool.query(query)
        res.status(200).json({
            data: result.rows
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR FETCHING")
    }
}

exports.deleteWidget = async (req, res) => {
    const deleteWidget = "DELETE FROM widget WHERE uuid=$1"
    try {
        const result = await pool.query(deleteWidget, [req.params.id])
        res.status(200).json({
            Message: "Deleted Successfully"
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR DELETING")
    }
}

