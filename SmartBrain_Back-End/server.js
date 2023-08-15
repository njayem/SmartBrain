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

// Import the register.js file
import { handleRegister } from "./controllers/register.js";
// const register = require("./controllers/register");

// Import the signin.js file
import { handleSignIn } from "./controllers/signin.js";
// const signin = require("./controllers/signin");

// Import the profile.js file
import { handleProfileGet } from "./controllers/profile.js";
// const profile = require("./controllers/profile");

// Import the image.js file
import { handleImage } from "./controllers/image.js";
// const image = require("./controllers/image");

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
	handleSignIn(req, res, db, bcrypt);
});
// ********** ROUTE (/profile/:userId) ********** //

// ********** ROUTE (/register) ********** //
app.post("/register", (req, res) => {
	handleRegister(req, res, db, bcrypt);
});

// ********** ROUTE (/register) ********** //

// ********** ROUTE (/profile/:userId) ********** //
app.get("/profile/:id", (req, res) => {
	handleProfileGet(req, res, db);
});
// ********** ROUTE (/profile/:userId) ********** //

// ********** ROUTE (/image) ********** //
app.put("/image", (req, res) => {
	handleImage(req, res, db);
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
