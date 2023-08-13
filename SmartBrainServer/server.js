// Import the express package
// Express allows us to create a server and listen to requests
// Express is middleware for node.js (it sits on top of node.js)
import express, { response } from "express";

// Import the body-parser package
import bodyParser from "body-parser";

// Import the cors package
// This package allows us to connect to the front end
import cors from "cors";

// Import the bcrypt package
import bcrypt from "bcrypt-nodejs";

// Import the knex package
import knex from "knex";

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		// port: "5432",
		user: "nmufti",
		password: "",
		database: "smart-brain",
	},
});

// This returns a promise
// So we can use .then to get the data from the DB
// db.select("*")
// 	.from("users")
// 	.then((data) => {
// 		console.log(data);
// 	});

// Create an express app
const app = express();

// In order to use body-parser we need to use app.use
// because it is a middleware
// WE ALWAYS DO THIS (AFTER) we create the app variable for express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

// 👇️ handle uncaught exceptions
process.on("uncaughtException", function (err) {
	console.log("The error is: ", err);
});

// ********** ROUTE (/) ********** //
app.get("/", (req, res) => {
	// res.send("This is working");
	res.send("Success!");
});
// ********** ROUTE (/) ********** //

// ********** ROUTE (/profile/:userId) ********** //
// The sign in route is a POST request because we are sending
// a password and want to send it inside the body of the request
// (aka what the user would input in an input form) to prevent
// exposing it in the URL (which would be the case if we used GET)

// We are sending hypothetical data from postman
// Pretending to be a user loggin in
// This data is in JSON format
// So we have to parse it to JS before we can check with the DB
// We need to use body-parser to do this
app.post("/signin", (req, res) => {
	db.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json("Unable to get user!"));
			} else {
				res.status(400).json("Wrong credentials!");
			}
		})
		.catch((err) => res.status(400).json("Wrong credentials!"));
});
// ********** ROUTE (/profile/:userId) ********** //

// ********** ROUTE (/register) ********** //
app.post("/register", (req, res) => {
	// We need to add the new user info from the request body

	// use destructuring to get the info from the request body
	// that has been parsed by body-parser to JS
	const { email, name, password } = req.body;

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
});

// ********** ROUTE (/register) ********** //

// ********** ROUTE (/profile/:userId) ********** //
app.get("/profile/:id", (req, res) => {
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
});
// ********** ROUTE (/profile/:userId) ********** //

// ********** ROUTE (/image) ********** //
app.put("/image", (req, res) => {
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
});
// ********** ROUTE (/image) ********** //

app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});

/*
(/) --> res = this is working

[ Sign in is POST because we are sending a password and want to 
  send it inside the body of the request ( aka what the user would 
  input in an input form) to prevent exposing it
  in the URL (which would be the case if we used GET) ]
[ This prevents man in the middle attacks ]
(/signin) --> POST = success/fail

(/register) --> POST = user

(/profile/:userId) --> GET = user

(/image) --> POST = user count
*/
