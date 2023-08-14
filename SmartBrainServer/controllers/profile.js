const handleProfileGet = (req, res, db) => {
	// To grab the id from the URL we use req.params and destructure it
	const { id } = req.params;
	// We need to grab the user from the database
	db.select("*")
		.from("users")
		.where({ id: id }) // or just .where({ id }) in ES6
		.then((user) => {
			console.log(user[0]);
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("User not found!");
			}
		})
		.catch((err) => {
			res.status(400).json("Error getting user!");
		});
};

export default handleProfileGet;
