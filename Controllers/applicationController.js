const pool = require("../db");

exports.addApplication = async (req, res) => {
	const {
		title,
		category_id,
		display_order,
		app_package,
		icon,
		active,
		hide_app,
	} = req.body;

	const created_by_id = req.user.id;
	const updated_by_id = req.user.id;
	const addAppQuery =
		"INSERT INTO application ( title,category_id,display_order, app_package,icon, active, hide_app,created_by_id, updated_by_id ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";
	try {
		const result = await pool.query(addAppQuery, [
			title,
			category_id || null,
			display_order,
			app_package,
			icon || null,
			active || true,
			hide_app || false,
			created_by_id,
			updated_by_id,
		]);

		res.status(201).json({
			Message: "Inserted Sucessfully",
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR");
		console.log(error);
		res.status(500).json("Error in adding");
	}
};

exports.getApplication = async (req, res) => {
	const getAppQuery =
		"Select a.*, c.category_name,d.url,d.uuid as dashboard_uuid,s.title as solution_title,uc.name AS created_by_name, uu.name AS updated_by_name FROM solution_category s right join category c on s.id=c.sol_category_id AND s.is_deleted=False  RIGHT JOIN application a  ON a.category_id=c.id AND c.is_deleted=FALSE LEFT JOIN dashboard d ON d.app_id=a.id LEFT JOIN users uc ON uc.uuid = a.created_by_id LEFT JOIN users uu ON uu.uuid = a.updated_by_id WHERE a.is_deleted=FALSE ORDER BY a.display_order,a.title";
	try {
		const result = await pool.query(getAppQuery);
		res.status(200).json({
			Message: "Data fetched",
			data: result.rows,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ Message: "Error Fetching" });
	}
};

exports.deleteApplication = async (req, res) => {
	const { id } = req.params;
	const updated_by_id = req.user.id;

	try {
		const appRes = await pool.query(
			`SELECT id FROM application  WHERE uuid=$1 AND is_deleted=FALSE`,
			[id]
		);

		if (appRes.rowCount === 0) {
			return res.status(404).json({
				Message: "Application not found",
			});
		}

		const appId = appRes.rows[0].id;

		const dashboardRes = await pool.query(
			`SELECT 1 FROM dashboard WHERE app_id=$1 AND is_deleted=FALSE LIMIT 1`,
			[appId]
		);

		if (dashboardRes.rowCount > 0) {
			return res.status(409).json({
				Message:
					"Cannot delete application. It is linked to an existing dashboard. Please delete that first",
			});
		}

		const deleteRes = await pool.query(
			`UPDATE application  SET is_deleted=TRUE, updated_at=NOW(), updated_by_id=$1 WHERE id=$2 RETURNING *`,
			[updated_by_id, appId]
		);

		res.status(200).json({
			Message: "Application deleted successfully",
			data: deleteRes.rows[0],
		});
	} catch (error) {
		console.error("Delete Application Error:", error);
		res.status(500).json({
			Message: "Error deleting application",
		});
	}
};

exports.updateApplication = async (req, res) => {
	const {
		title,
		category_id,
		display_order,
		app_package,
		icon,
		active,
		hide_app,
	} = req.body;

	const updateAppQuery =
		"UPDATE application SET title=$1,category_id=$2,display_order=$3, app_package=$4,icon=$5, active=$6, hide_app=$7, updated_at=NOW(), updated_by_id=$8 WHERE (uuid=$9 and is_deleted=FALSE) returning *";
	const updated_by_id = req.user.id;
	try {
		const result = await pool.query(updateAppQuery, [
			title,
			category_id || null,
			display_order,
			app_package,
			icon || null,
			active,
			hide_app || false,
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json({
			Message: "Data Updating",
			data: result.rows,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json("Error Updating");
	}
};
