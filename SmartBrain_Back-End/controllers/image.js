const handleImage = (req, res, db) => {
	// We need to grab the id from the request body
	const { id } = req.body;
	db("users")
		.where("id", "=", id)
		.increment({
			entries: 1,
		})
		.returning("entries")
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => {
			res.status(400).json("Unable to get entries!");
		});
};

export { handleImage };
