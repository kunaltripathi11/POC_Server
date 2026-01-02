const pool = require("../db");

const addAppQuery =
	"INSERT INTO application ( title,display_order, app_package,icon,created_by_id, updated_by_id ) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,app_package ";
exports.addDashboard = async (req, res) => {
	let {
		name,
		title,
		app_id,
		url,
		remove_filter,
		app_package,
		create_app,
		app_title,
		icon,
		display_order,
	} = req.body;

	const created_by_id = req.user.id;
	const updated_by_id = req.user.id;
	const checkUnique = await pool.query(
		"SELECT * FROM dashboard WHERE name=$1 or url=$2 ",
		[name, url]
	);

	if (checkUnique.rows.length > 0) {
		res.status(501).json({
			Message: "Url or name is not unique",
		});
		return;
	}

	const addDashboardQuery =
		"INSERT INTO dashboard (name,title,app_id,url,remove_filter,app_package, created_by_id, updated_by_id) VALUES($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *";
	try {
		if (create_app == true) {
			const result = await pool.query(addAppQuery, [
				app_title,
				display_order,
				app_package,
				icon || null,
				created_by_id,
				updated_by_id,
			]);

			app_package = result.rows[0].app_package;
			app_id = result.rows[0].id;
		}

		const result = await pool.query(addDashboardQuery, [
			name,
			title,
			app_id,
			url,
			remove_filter || false,
			app_package,
			created_by_id,
			updated_by_id,
		]);
		res.status(200).json({
			Message: "Dashboard Inserted sucessfully",
			data: result.rows[0],
		});
	} catch (error) {
		console.log("ERROR ", error);

		res.status(500).json("ERROR INSERTING");
		throw new Error(" Error Inserting Data");
	}
};

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
		display_order,
	} = req.body;

	const created_by_id = req.user.id;
	const updated_by_id = req.user.id;
	const checkuUnique = await pool.query(
		"SELECT * FROM dashboard WHERE name=$1 or url=$2 ",
		[name, url]
	);

	if (checkuUnique.rows.length > 1) {
		res.status(501).json({
			Message: "Url or name is not unique",
		});
		return;
	}

	const updateDashboardQuery =
		"UPDATE dashboard SET name=$1,title=$2,app_id=$3,url=$4,remove_filter=$5,app_package=$6,updated_by_id=$7 WHERE uuid=$8 and is_deleted =FALSE RETURNING *";

	try {
		if (createApp == true) {
			const result = await pool.query(addAppQuery, [
				app_title,
				display_order,
				app_package,
				iconName || null,
				created_by_id,
				updated_by_id,
			]);

			app_package = result.rows[0].app_package;
			app_id = result.rows[0].id;
		}
		console.log("UPDATED", updated_by_id);
		const result = await pool.query(updateDashboardQuery, [
			name,
			title,
			app_id,
			url,
			remove_filter || false,
			app_package,
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json(
			"Dashboard Updated sucessfully",

			{
				data: result.rows,
			}
		);
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR Updating");
	}
};

exports.getDashboard = async (req, res) => {
	const getDashboard =
		"SELECT d.*, a.title as Application, uc.name AS created_by_name,uu.name AS updated_by_name from dashboard d join application a on d.app_id=a.id LEFT JOIN users uc ON uc.uuid = d.created_by_id LEFT JOIN users uu ON uu.uuid = d.updated_by_id WHERE d.is_deleted=FALSE";

	try {
		const result = await pool.query(getDashboard);
		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		// console.log("ERROR ", error);
		res.status(500).json({ message: "ERROR FETCHING" });
		// throw new Error(" Error Fetching Data");
	}
};

exports.getDashboardById = async (req, res) => {
	const getDashboard =
		"SELECT d.*, a.title as Application ,uc.name AS created_by_name,uu.name AS updated_by_name   from dashboard d join application a on d.app_id=a.id LEFT JOIN users uc ON uc.uuid = d.created_by_id LEFT JOIN users uu ON uu.uuid = d.updated_by_id WHERE d.uuid=$1 and d.is_deleted=FALSE";

	try {
		const result = await pool.query(getDashboard, [req.params.id]);
		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR FETCHING");
	}
};

exports.deleteDashboard = async (req, res) => {
	const deleteDashboard =
		"UPDATE dashboard SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1 WHERE uuid=$2 and is_deleted=false RETURNING * ";
	const updated_by_id = req.user.id;
	try {
		const result = await pool.query(deleteDashboard, [
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json({
			Message: "Deleted Successfully",
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR DELETING");
	}
};

exports.fetchApplicationWithNoDashboard = async (req, res) => {
	const fetchQuery =
		"SELECT a.* FROM application a LEFT JOIN dashboard d ON a.id=d.app_id  WHERE d.app_id IS NULL AND a.is_deleted=false ";
	try {
		const result = await pool.query(fetchQuery);
		res.status(200).json({
			Message: "Fetched Successfully",
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR Fetching");
	}
};
