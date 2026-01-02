const pool = require("../db");

// add data model
exports.addDataModel = async (req, res) => {
	const insertQuery =
		"INSERT INTO data_model (name,description,app_package,primary_key_field,query, created_by_id, updated_by_id) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *";
	const { name, description, app_package, primary_key_field, query } =
		req.body;
	const created_by_id = req.user.id;
	const updated_by_id = req.user.id;
	try {
		const result = await pool.query(insertQuery, [
			name,
			description || null,
			app_package || null,
			primary_key_field || null,
			query,
			created_by_id,
			updated_by_id,
		]);
		res.status(201).json({
			success: "success",
			data: result.rows[0],
		});
	} catch (error) {
		console.error("Error :" + error);
		res.status(501);
		res.json("Error inserting data", error);
	}
};

//Get data model

exports.getDataModels = async (req, res) => {
	const getQuery =
		"SELECT d.*, uc.name AS created_by_name,uu.name AS updated_by_name FROM data_model d LEFT JOIN users uc ON uc.uuid = d.created_by_id LEFT JOIN users uu ON uu.uuid = d.updated_by_id WHERE is_deleted=FALSE";
	try {
		const result = await pool.query(getQuery);
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
	const updated_by_id = req.user.id;

	try {
		const data_model_id = await pool.query(
			`select id from data_model where uuid=$1`,
			[id]
		);
		const checkQuery = `SELECT 1 FROM business_rules WHERE data_model_id = $1 AND is_deleted = FALSE LIMIT 1 `;

		const checkResult = await pool.query(checkQuery, [
			data_model_id.rows[0].id,
		]);

		if (checkResult.rowCount > 0) {
			return res.status(409).json({
				success: false,
				message:
					"Cannot delete Data Model. It is linked to one or more Business Rules.",
			});
		}

		const deleteQuery = `UPDATE data_model SET is_deleted = TRUE, updated_at = NOW(), updated_by_id = $1 WHERE uuid = $2`;

		await pool.query(deleteQuery, [updated_by_id, id]);

		res.status(200).json({
			success: true,
			message: "Data model deleted successfully",
		});
	} catch (error) {
		console.error("Delete Data Model Error:", error);
		res.status(500).json({
			success: false,
			message: "Error deleting data model",
		});
	}
};

// Update Data Model

exports.updateDataModel = async (req, res) => {
	const { id } = req.params;

	const updated_by_id = req.user.id;

	const updateQuery =
		"UPDATE data_model SET name=$1, description=$2, app_package=$3,primary_key_field=$4,query=$5,  updated_by_id=$6, updated_at= NOW() WHERE uuid=$7 ";
	const { name, description, app_package, primary_key_field, query } =
		req.body;
	try {
		const results = await pool.query(updateQuery, [
			name,
			description || null,
			app_package || null,
			primary_key_field || null,
			query,
			updated_by_id,
			id,
		]);
		res.status(200).json({
			Message: "Update Successful",
			data: results.rows[0],
			success: true,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json("Error In updating user");
	}
};

exports.getRulesByModelId = async (req, res) => {
	const { id } = req.params;
	try {
		const data_model_id = await pool.query(
			`select id from data_model where uuid=$1`,
			[id]
		);
		if (data_model_id.rowCount === 0) {
			return res.status(404).json({ Message: "Data model not found" });
		}
		const getRules = await pool.query(
			`SELECT name,uuid, updated_at FROM business_rules WHERE data_model_id=$1`,
			[data_model_id.rows[0].id]
		);

		res.status(201).json({ Message: "Data Fetched", data: getRules.rows });
	} catch (error) {
		res.status(401).json({ Message: "Unable to fetch data" });
		console.log("Error", error);
	}
};
