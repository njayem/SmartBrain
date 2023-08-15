const handleRegister = (req, res, db, bcrypt) => {
	// We need to add the new user info from the request body

	// use destructuring to get the info from the request body
	// that has been parsed by body-parser to JS
	const { email, name, password } = req.body;

	// We need to make sure that the user has entered all the info
	// Blank information is not allowed
	if (!email || !name || !password) {
		return res.status(400).json("Incorrect form submission!");
	}

	// We need to hash the password before we store it in the DB
	// We use bcrypt to do this
	const hash = bcrypt.hashSync(password);

	// We use .transaction to make sure that both tables are updated
	// at the same time
	// We use trx instead of db to do these operations
	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx("users")
					.returning("*")
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) => {
		res.status(400).json("Unable to register!");
	});
};

export { handleRegister };
