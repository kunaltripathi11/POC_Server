const pool = require("../db");
let userID = "c0f715b5-9800-41a5-80df-69e73767765b";

exports.addSolCategory = async (req, res) => {
	const { title } = req.body;
	const addSolCatQuery =
		"INSERT INTO solution_category (title,created_by_id,updated_by_id) VALUES ($1,$2,$3) RETURNING *";
	const created_by_id = userID;
	const updated_by_id = userID;
	try {
		const result = await pool.query(addSolCatQuery, [
			title,
			created_by_id,
			updated_by_id,
		]);

		res.status(200).json({
			Message: "Solution Category Inserted sucessfully",
			data: result.rows[0],
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR INSERTING");
	}
};

exports.updateSolCategory = async (req, res) => {
	const { title } = req.body;
	const addSolCatQuery =
		"UPDATE solution_category SET title=$1,updated_by_id=$2, updated_at=NOW() WHERE uuid=$3 returning *";

	const updated_by_id = userID;
	try {
		const result = await pool.query(addSolCatQuery, [
			title,
			updated_by_id,
			req.params.id,
		]);
		// console.log(result);
		res.status(200).json({
			Message: "Solution Category Updated sucessfully",
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR UPDATING");
	}
};

exports.getSolCategory = async (req, res) => {
	const getSolCategory =
		"SELECT id,UUID, title from solution_category WHERE is_deleted=FALSE order by id";

	try {
		const result = await pool.query(getSolCategory);
		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR FETCHING");
	}
};

exports.deleteSolCategory = async (req, res) => {
	const deleteSolCategory =
		"UPDATE solution_category SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1 WHERE uuid=$2";
	const updated_by_id = userID;
	try {
		const result = await pool.query(deleteSolCategory, [
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json({
			Message: "Deleted Successfully",
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR DELETING");
	}
};
