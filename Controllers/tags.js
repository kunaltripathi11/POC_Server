const pool = require("../db");

let userID = "c0f715b5-9800-41a5-80df-69e73767765b";

exports.addTag = async (req, res) => {
	const { tags, business_rule_id } = req.body;

	try {
		const addedTags = [];
		for (let tag of tags) {
			let tagId;
			tag = tag.toLowerCase();
			const checkTagQuery = "SELECT id FROM tags WHERE tag=$1";
			const check = await pool.query(checkTagQuery, [tag]);

			if (check.rows.length > 0) {
				tagId = check.rows[0].id;
			} else {
				const addToTagQuery =
					"INSERT INTO tags (tag) VALUES ($1) RETURNING id";
				const result = await pool.query(addToTagQuery, [tag]);
				tagId = result.rows[0].id;
			}

			const checkRelationQuery =
				"SELECT * FROM tag_rules WHERE tag_id=$1 AND rule_id=$2";
			const existingRelation = await pool.query(checkRelationQuery, [
				tagId,
				business_rule_id,
			]);

			if (existingRelation.rows.length === 0) {
				const addToTagsRulesTable =
					"INSERT INTO tag_rules (tag_id, rule_id) VALUES ($1, $2)";
				await pool.query(addToTagsRulesTable, [
					tagId,
					business_rule_id,
				]);
			}

			addedTags.push(tag);
		}

		res.status(201).json({
			message: `Tags added successfully: ${addedTags.join(", ")}`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred while adding tags." });
	}
};

exports.getTag = async (req, res) => {
	if (req.body.inputTag == null) {
		// console.log("Input Tag null");
		res.status(200).send("No Tags Available");
		return;
	}
	checkInputTag = ("%" + req.body.inputTag + "%").toLowerCase();

	const getTagQuery =
		"SELECT tag from tags WHERE tag LIKE $1 and is_deleted = FALSE";
	try {
		const result = await pool.query(getTagQuery, [checkInputTag]);

		if (result.rows.length == 0) {
			res.send("No Tags Available");
			// console.log("result rows 0");
		} else {
			const foundTags = [];
			for (let i = 0; i < result.rows.length; i++) {
				foundTags.push(result.rows[i].tag);
			}

			res.status(200).json({
				data: foundTags,
			});
		}
	} catch (error) {
		console.log("Error", error);
		res.status(500).json("Error Fetching Tags");
	}
};

exports.updateTags = async (req, res) => {
	const updateTagQuery = "UPDATE tags SET tag=$1 WHERE id=$2";
};
