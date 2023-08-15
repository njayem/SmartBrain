import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
// import Clarifai from "clarifai";
import "./App.css";

// const app = new Clarifai.App({
// 	apiKey: "b2977460c0b442b8a027080ec68659b2",
// });

//* ******************************************************* *//
// CLARIFY API CALL //
//* ******************************************************* *//
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////
const returnClarifaiJSONRequest = (imageUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = "69dad3ab303f4fff82f864adb6a6cf60";
	// Specify the correct user_id/app_id pairings
	// Since you're making inferences outside your app's scope
	const USER_ID = "njayem";
	const APP_ID = "SmartBrain";
	// Change these to whatever model and image URL you want to use
	const IMAGE_URL = imageUrl;

	///////////////////////////////////////////////////////////////////////////////////
	// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
	///////////////////////////////////////////////////////////////////////////////////

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: IMAGE_URL,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: "Key " + PAT,
		},
		body: raw,
	};
	return requestOptions;
};
//* ******************************************************* *//
//* ******************************************************* *//

// CREATE AN INITIAL STATE FOR THE APP
const initialState = {
	input: "",
	imageUrl: "",
	box: {},
	route: "signin",
	isSignedIn: false,
	user: {
		id: "",
		name: "",
		email: "",
		entries: 0,
		joined: "",
	},
};

class App extends Component {
	//We need to keep track of the input value in the input box
	//So we need to create a state using constructor
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	calculateFaceLocation = (data) => {
		console.log("Data", data);
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box;

		console.log("Clarifai Face Location Data:", clarifaiFace);

		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		console.log("width:", width);
		const height = Number(image.height);
		console.log("height:", height);

		return {
			left_col: clarifaiFace.left_col * width,
			top_row: clarifaiFace.top_row * height,
			right_col: width - clarifaiFace.right_col * width,
			bottom_row: height - clarifaiFace.bottom_row * height,
		};
	};

	// This updates the box state
	displayFaceBox = (box) => {
		console.log("BOX OBJECT:", box);
		this.setState({ box: box });
	};

	// We need to create a function that will listen to the input change
	// and update the state
	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		console.log("click");
		this.setState({ imageUrl: this.state.input });
		//console.log("the state input is:", this.state.input);

		fetch(
			"https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
			returnClarifaiJSONRequest(this.state.input)
		)
			.then((response) => response.json())
			.then((result) => {
				if (result) {
					//console.log("RESULTTT:", result);
					fetch("http://localhost:3000/image", {
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => {
							return response.json();
						})
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
							console.log("COUNT:", count);
						})
						.catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(result));
			})
			.catch((error) => console.log("error", error));
	};

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState(initialState);
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	render() {
		const { imageUrl, box, route, isSignedIn } = this.state;
		console.log("imageUrl:", imageUrl);
		console.log("box:", box);

		return (
			<div className="App">
				<ParticlesBg color="#ffffff" type="cobweb" bg={true} num={300} />
				<Navigation
					isSignedIn={isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{route === "home" ? (
					<div>
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition imageUrl={imageUrl} box={box} />{" "}
					</div>
				) : route === "signin" ? (
					<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				) : (
					<Register
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				)}
			</div>
		);
	}
}

export default App;
