const pool = require("../db");

exports.addWidget = async (req, res) => {
	const { dashboard_id, widget_type } = req.body;

	const addWidgetQuery =
		"INSERT INTO widget (dashboard_id,widget_type,created_by_id,updated_by_id) VALUES ($1,$2,$3,$4) RETURNING *";
	const created_by_id = req.user.id;
	const updated_by_id = req.user.id;

	try {
		const result = await pool.query(addWidgetQuery, [
			dashboard_id,
			widget_type,
			created_by_id,
			updated_by_id,
		]);

		await pool.query(
			"UPDATE dashboard SET updated_by_id=$1, updated_at=NOW() WHERE id=$2",
			[updated_by_id, dashboard_id]
		);

		res.status(200).json({
			Message: "Widget Inserted sucessfully",
			data: result.rows[0],
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR INSERTING");
	}
};
exports.getModelByRule = async (req, res) => {
	const { business_rule_id } = req.body;

	const getDataModelId =
		"SELECT b.uuid as rule_uuid,d.uuid as model_uuid,d.name,b.data_model_id FROM  business_rules b join data_model d on d.id=b.data_model_id WHERE b.id=$1 ";
	try {
		const response = await pool.query(getDataModelId, [business_rule_id]);

		res.status(200).json({
			data: response.rows[0],
			success: "success",
		});
	} catch (error) {
		console.log("ERROR", error);
	}
};

exports.updateWidget = async (req, res) => {
	const { name, dashboard_id, data_model_id, business_rule_id } = req.body;

	const addCatQuery =
		"UPDATE widget SET name=$1,dashboard_id=$2,business_rule_id=$3,data_model_id=$4,updated_by_id=$5, updated_at=NOW() WHERE uuid=$6 and is_deleted=false returning *";

	const updated_by_id = req.user.id;
	try {
		const result = await pool.query(addCatQuery, [
			name || "New Widget",
			dashboard_id,
			business_rule_id,
			data_model_id,
			updated_by_id,
			req.params.id,
		]);
		res.status(200).json({
			Message: "Widget Updated sucessfully",
			data: result.rows,
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR UPDATING");
	}
};

exports.getWidget = async (req, res) => {
	const getDashboardId = await pool.query(
		`SELECT id from dashboard where ${req.query.variable}=$1 and is_deleted=false`,
		[req.query.id]
	);

	const getWidget = await pool.query(
		`SELECT * from widget where dashboard_id=${getDashboardId.rows[0].id} order by business_rule_id `
	);

	const getWidgetData = await pool.query(
		`SELECT d.query, w.*  FROM widget w left join data_model d on d.id=w.data_model_id join business_rules b on b.data_model_id=d.id where w.dashboard_id=${getDashboardId.rows[0].id} order by w.business_rule_id`
	);

	const dash_id = getDashboardId.rows[0].id;
	const finalResult = [];

	for (let i = 0; i < getWidget.rows.length; i++) {
		const query = getWidgetData?.rows[i]?.query || null;
		const data_model_id = getWidgetData?.rows[i]?.data_model_id || null;

		const widget = {};

		widget.dash_id = dash_id;
		widget.data_model_id = data_model_id;

		try {
			if (query) {
				const result = await pool.query(query);

				widget.query = result.rows;

				widget.columns = result.fields.map((f) => f.name);
			} else {
				widget.query = null;
			}
			// widget.dash_id = getDashboardId.rows[0]?.id;

			widget.uuid = getWidget.rows[i].uuid;

			widget.rule_id = getWidget.rows[i].business_rule_id;
			widget.name = getWidget.rows[i].name;

			finalResult.push(widget);
			// res.status(200).json({
			// 	data: result.rows,
			// });
		} catch (error) {
			console.log("ERROR ", error);
			res.status(500).json("ERROR FETCHING");
		}
	}
	res.status(200).json({
		data: finalResult,
		dashboard_id: dash_id,
	});
};

exports.deleteWidget = async (req, res) => {
	const deleteWidget = "DELETE FROM widget WHERE uuid=$1";

	const updated_by_id = req.user.id;
	const { uuid } = req.body;

	try {
		const result = await pool.query(deleteWidget, [req.params.id]);

		await pool.query(
			"UPDATE dashboard SET updated_by_id=$1, updated_at=NOW() WHERE uuid=$2",
			[updated_by_id, uuid]
		);
		res.status(200).json({
			Message: "Deleted Successfully",
		});
	} catch (error) {
		console.log("ERROR ", error);
		res.status(500).json("ERROR DELETING");
	}
};
