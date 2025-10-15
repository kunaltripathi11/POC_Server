
const pool = require('../db')
let userID = 'c0f715b5-9800-41a5-80df-69e73767765b'

exports.addCategory = async (req, res) => {

    const {
        category_name,
        display_order,
        sol_category_id
    } = req.body

    const addCatQuery = "INSERT INTO category (category_name,display_order,sol_category_id,created_by_id,updated_by_id) VALUES ($1,$2,$3,$4,$5)"
    const created_by_id = userID
    const updated_by_id = userID

    try {
        const result = await pool.query(addCatQuery, [category_name, display_order || null, sol_category_id || null, created_by_id, updated_by_id])
        res.status(200).json("Category Inserted sucessfully")


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR INSERTING")
    }


}

exports.updateCategory = async (req, res) => {

    const { category_name, display_order, sol_category_id } = req.body
    const addCatQuery = "UPDATE category SET category_name=$1,display_order=$2,sol_category_id=$3,updated_by_id=$4, updated_at=NOW() WHERE uuid=$5 returning *"

    const updated_by_id = userID
    try {
        const result = await pool.query(addCatQuery, [category_name, display_order || null, sol_category_id || null, updated_by_id, req.params.id])
        // console.log(result);
        res.status(200).json({
            Message: "Category Updated sucessfully",
            data: result.rows
        }
        )


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR UPDATING")
    }


}

exports.getCategory = async (req, res) => {
    const getCategory = "SELECT c.id, s.title as SolutionCategory  ,c.category_name,c.display_order from solution_category s right join category c on c.sol_category_id=s.id WHERE c.is_deleted=FALSE"

    try {
        const result = await pool.query(getCategory)
        res.status(200).json({
            data: result.rows
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR FETCHING")
    }
}

exports.deleteCategory = async (req, res) => {
    const deleteCategory = "UPDATE category SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1 WHERE uuid=$2"
    const updated_by_id = userID
    try {
        const result = await pool.query(deleteCategory, [updated_by_id, req.params.id])
        res.status(200).json({
            Message: "Deleted Successfully"
        })


    } catch (error) {
        console.log("ERROR ", error);
        res.status(500).json("ERROR DELETING")
    }
}

