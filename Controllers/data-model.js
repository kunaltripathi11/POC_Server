const pool = require("../db");

let userID = "c0f715b5-9800-41a5-80df-69e73767765b";
// add data model
exports.addDataModel = async (req, res) => {
	const insertQuery =
		"INSERT INTO data_model (name,description,app_package,primary_key_field,query, created_by_id, updated_by_id) VALUES ($1,$2,$3,$4,$5,$6,$7)";
	const {
		name,
		description,
		app_package,
		primary_key_field,
		query,
		updated_by_id,
	} = req.body;
	const created_by_id = userID;
	try {
		const result = await pool.query(insertQuery, [
			name,
			description || null,
			app_package || null,
			primary_key_field || null,
			query,
			created_by_id,
			updated_by_id || null,
		]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error :" + error);
		res.status(501);
		res.json("Error inserting data", error);
	}
};

//Get data model

exports.getDataModels = async (req, res) => {
	const getQuery =
		"SELECT uuid,name,description,primary_key_field, (Select name as createdBy from users where id=$1 ),created_at, (Select name as updatedBy from users where id=$2 ), updated_at FROM data_model WHERE is_deleted=FALSE";
	try {
		const result = await pool.query(getQuery, [userID, userID]);
		res.status(200).json({
			message: "Success",
			data: result.rows,
		});
	} catch (error) {
		console.log("Error Fetching: " + error);
		res.status(500).json({
			status: failed,
			data: "error getting data",
		});
	}
};

// Delete data model

exports.deleteDataModel = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	const updated_by_id = userID;
	deleteQuery =
		"UPDATE data_model SET is_deleted=TRUE, updated_at = NOW(), updated_by_id=$1 WHERE uuid = $2 returning *";
	try {
		const result = await pool.query(deleteQuery, [updated_by_id, id]);
		res.status(200).json("Data model deleted");
	} catch (error) {
		res.status(500).json("Error deleting user");
	}
};

// Update Data Model

exports.updateDataModel = async (req, res) => {
	const { id } = req.params;

	const updated_by_id = userID;

	const updateQuery =
		"UPDATE data_model SET name=$1, description=$2, app_package=$3,primary_key_field=$4,query=$5,  updated_by_id=$6, updated_at=NOW() WHERE id=$7 ";
	const { name, description, app_package, primary_key_field, query } =
		req.body;
	try {
		const results = await pool.query(updateQuery, [
			name,
			description || null,
			app_package || null,
			primary_key_field || null,
			query,
			updated_by_id || null,
			id,
		]);
		console.log("Update Successful");
		res.status(200).json("Update Successful", results.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error In updating user");
	}
};
