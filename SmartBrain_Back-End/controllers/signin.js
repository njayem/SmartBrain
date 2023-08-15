const handleSignIn = (req, res, db, bcrypt) => {
	// use destructuring to get the info from the request body
	// that has been parsed by body-parser to JS
	const { email, password } = req.body;

	// We need to make sure that the user has entered all the info
	// Blank information is not allowed
	if (!email || !password) {
		return res.status(400).json("Incorrect form submission!");
	}

	db.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json("Unable to get user!"));
			} else {
				res.status(400).json("Wrong credentials!");
			}
		})
		.catch((err) => res.status(400).json("Wrong credentials!"));
};

export { handleSignIn };
