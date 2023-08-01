import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ParticlesBg from "particles-bg";
import Clarifai from "clarifai";
import "./App.css";

const app = new Clarifai.App({
	apiKey: "b2977460c0b442b8a027080ec68659b2",
});
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
	const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

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

class App extends Component {
	//We need to keep track of the input value in the input box
	//So we need to create a state using constructor
	constructor() {
		super();
		this.state = {
			input: "",
			imageUrl: "",
		};
	}

	// displayFaceBox = (box) => {
	// 	this.setState({ box: box });
	// };

	// We need to create a function that will listen to the input change
	// and update the state
	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });

		app.models
			.predict("face-detection", this.state.input)
			.then((response) => {
				console.log("hi", response);
				if (response) {
					fetch("http://localhost:3000/image", {
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					}).then((response) => response.json());
					// .then((count) => {
					// 	this.setState(Object.assign(this.state.user, { entries: count }));
					// });
				}

				// this.desplayFaceBox(this.calculateFaceLocation(response));
			})
			.catch((err) => console.log(err));
	};
	render() {
		const { imageUrl } = this.state;
		return (
			<div className="App">
				<ParticlesBg color="#ffffff" type="cobweb" bg={true} num={300} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>
				<FaceRecognition imageUrl={imageUrl} />
			</div>
		);
	}
}

export default App;
