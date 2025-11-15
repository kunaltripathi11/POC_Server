const pool = require("../db");

let userID = "c0f715b5-9800-41a5-80df-69e73767765b";
exports.addBuisnessRules = async (req, res) => {
	const {
		name,
		description,
		reserved_rules,
		data_model_id,
		app_package,
		workflow,
		user_specific_field_id,
		multiple_user_specific_field_id,
		link_to,
		destination_id,
	} = req.body;

	if (link_to == null) {
		destination_id = null;
	} else {
		if (destination_id == null) {
			console.error("Destination ID cannot be null");
			return;
		}
	}
	const addQuery =
		"INSERT INTO business_rules (name,description,reserved_rules,data_model_id,app_package,workflow,user_specific_field_id,multiple_user_specific_field_id,link_to,destination_id, created_by_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";

	const created_by_id = userID;
	try {
		const result = await pool.query(addQuery, [
			name,
			description || null,
			reserved_rules || false,
			data_model_id,
			app_package || null,
			workflow || null,
			user_specific_field_id || null,
			multiple_user_specific_field_id || null,
			link_to || null,
			destination_id || null,
			created_by_id,
		]);

		res.status(200).json({
			rule: result.rows[0],
			data: "Buisness rule sucessfully created",
		});
	} catch (error) {
		console.log(error);
		res.status(501).json("ERROR in ENTERING BUSINESS RULES");
	}
};

exports.getBusinessRules = async (req, res) => {
	const getRulesQuery =
		"select  br.uuid,br.name, br.description, STRING_AGG(t.tag, ', ') as tags from business_rules br left join tag_rules tr on tr.rule_id = br.id left join tags t on t.id = tr.tag_id where br.is_deleted=False group by br.id, br.name  ";

	try {
		const result = await pool.query(getRulesQuery);

		res.status(200).json({
			message: "success",
			data: result.rows,
		});
	} catch (error) {
		console.error("ERROR IN FETCHING", error);
		res.status(500).json("ERROR IN FETCHING");
	}
};

exports.deleteBusinessRules = async (req, res) => {
	const deleteRuleQuery =
		"Update business_rules SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1  WHERE uuid=$2";
	let updated_by_id = userID;

	try {
		const result = await pool.query(deleteRuleQuery, [
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json("Business Rule deleted");
	} catch (error) {
		console.log(error);
		res.status(500).json("Error deleting user");
	}
};
exports.getDeletedBusinessRules = async (req, res) => {
	const getRulesQuery =
		"SELECT name AS NAME, description AS DESCRIPTION FROM business_rules WHERE is_deleted=TRUE";
	try {
		const result = await pool.query(getRulesQuery);

		res.status(200).json(result.rows);
	} catch (error) {
		console.error("ERROR IN FETCHING", error);
		res.status(500).json("ERROR IN FETCHING");
	}
};

exports.getBusinessRulesById = async (req, res) => {
	const getQueryFromDataModel =
		"select d1.query from data_model d1 right join business_rules b1 on (d1.id=b1.data_model_id);";
	try {
		const queryModel = await pool.query(getQueryFromDataModel);
		// console.log(queryModel);
		const dataQuery = queryModel.rows[0].query;

		const result = await pool.query(dataQuery);

		res.status(201).json({
			data: result.rows,
			Message: "Data fetched sucessfully",
		});
	} catch (error) {
		res.status(500).json("Error FETCHING");
	}
};

exports.updateBusinessRule = async (req, res) => {
	const {
		name,
		description,
		reserved_rules,
		data_model_id,
		app_package,
		workflow,
		user_specific_field_id,
		multiple_user_specific_field_id,
		link_to,
		destination_id,
	} = req.body;

	if (link_to == null) {
		destination_id == null;
	} else {
		if (destination_id == null) {
			console.error("Destination ID cannot be null");
			return;
		}
	}

	const { id } = req.params;
	const updateRuleQuery =
		"UPDATE business_rules SET name = $1,description = $2,reserved_rules = $3,data_model_id=$4,app_package=$5,workflow=$6,user_specific_field_id=$7,multiple_user_specific_field_id=$8,link_to=$9,destination_id=$10, updated_at=NOW(), updated_by_id=$11 WHERE uuid=$12";

	const updated_by_id = userID;
	try {
		const result = await pool.query(updateRuleQuery, [
			name,
			description || null,
			reserved_rules || false,
			data_model_id,
			app_package || null,
			workflow || null,
			user_specific_field_id || null,
			multiple_user_specific_field_id || null,
			link_to || null,
			destination_id || null,
			updated_by_id,
			id,
		]);

		res.status(200).json({
			data1: result.rows[0],
			data: "Buisness rule sucessfully updated",
		});
	} catch (error) {
		console.log(error);
		res.status(501).json("ERROR in ENTERING BUSINESS RULES");
	}
};
